export interface CacheEntry<T = unknown> {
  key: string;
  value: T;
  ttl?: number;
}

// ----- Function types -----

export type GetCacheFn = <T = unknown>(
  key: string
) => Promise<CacheEntry<T> | null>;

export type SetCacheFn = <T = unknown>(
  key: string,
  value: T,
  ttl?: number
) => Promise<boolean>;

export type HasCacheFn = (key: string) => Promise<boolean>;

export type DeleteCacheFn = (key: string) => Promise<boolean>;
