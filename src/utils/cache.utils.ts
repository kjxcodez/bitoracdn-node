export function getTTLForPath(path: string): number {
    if (path.endsWith(".html")) return 60;
    if (path.endsWith(".json")) return 120;
    if (/\.(js|css)$/.test(path)) return 600;
    if (/\.(png|jpg|jpeg|webp|gif)$/.test(path)) return 3600;
    return 300;
}