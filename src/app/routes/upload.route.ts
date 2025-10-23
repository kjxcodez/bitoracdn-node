import { Router, Request, Response } from "express";
import multer from "multer";
import { supabase } from "@/app/services/supabase-client.js";
import { config } from "@/app/config/env.config.js";

export const uploadRouter = Router();
const upload = multer({ storage: multer.memoryStorage() }); // buffer in memory

/**
 * POST /upload
 * Upload a file to Supabase CDN bucket
 */
uploadRouter.post("/", upload.single("file"), async (req: Request, res: Response) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const filePath = `/${file.originalname}`;
    console.log(`🆙 Uploading ${filePath} (${file.size} bytes)`);

    // Upload to Supabase
    const { data, error } = await supabase.storage
      .from(config.SUPABASE.bucket!)
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        upsert: true, // overwrite if exists
      });

    if (error) throw error;

    // Get public URL
    const { data: publicData } = supabase.storage
      .from(config.SUPABASE.bucket!)
      .getPublicUrl(filePath);

    return res.status(200).json({
      success: true,
      key: filePath,
      url: publicData.publicUrl,
      size: file.size,
      type: file.mimetype,
    });
  } catch (err: any) {
    console.error("❌ Upload error:", err.message);
    res.status(500).json({ error: "Upload failed" });
  }
});
