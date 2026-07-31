import crypto from 'crypto';

/**
 * Generate a SHA-256 non-PII client fingerprint hash from IP and User-Agent.
 */
export function generateFingerprint(ip, userAgent) {
  const raw = `${ip || '127.0.0.1'}:${userAgent || 'unknown'}`;
  return crypto.createHash('sha256').update(raw).digest('hex').substring(0, 16);
}

// Configurable Rate Limiting Engine (Default: 0 / disabled)
export const RateLimiterConfig = {
  enabled: false,
  maxEditsPerMinute: 60,
  burstLimit: 100
};

const userEditTracker = new Map();

/**
 * Check if fingerprint exceeds rate limits.
 */
export function checkRateLimit(fingerprint) {
  if (!RateLimiterConfig.enabled) return { allowed: true };

  const now = Date.now();
  const windowMs = 60 * 1000;
  let record = userEditTracker.get(fingerprint);

  if (!record) {
    record = [];
    userEditTracker.set(fingerprint, record);
  }

  // Filter timestamps within current window
  record = record.filter(t => now - t < windowMs);
  userEditTracker.set(fingerprint, record);

  if (record.length >= RateLimiterConfig.maxEditsPerMinute) {
    return {
      allowed: false,
      retryAfterMs: windowMs - (now - record[0])
    };
  }

  record.push(now);
  return { allowed: true };
}
