import type { Pixel, BoardPreset } from '../types/pixel';

export interface IBoardService {
  fetchInitialBoard(preset?: BoardPreset): Promise<Pixel[]>;
  fetchSnapshotAt(timestamp: number, preset?: BoardPreset): Promise<Pixel[]>;
  savePixelToFirestore(pixel: Pixel): Promise<void>;
  subscribeToCloudRealtime(preset: BoardPreset, onPixelUpdate: (pixel: Pixel) => void): () => void;
}

export class BoardService implements IBoardService {
  private firestoreBaseUrl = 'https://firestore.googleapis.com/v1/projects/geireann/databases/(default)/documents/pixels';
  private lastKnownTimestamps: Map<string, number> = new Map();

  // Exponential backoff state for 429 rate limit handling
  private pollIntervalMs = 10_000;          // 10s baseline (was 800ms)
  private readonly MIN_POLL_MS = 10_000;    // Floor: 10 seconds
  private readonly MAX_POLL_MS = 60_000;    // Ceiling: 60 seconds
  private consecutiveErrors = 0;
  private isRateLimited = false;

  async fetchInitialBoard(preset: BoardPreset = '1080x1080'): Promise<Pixel[]> {
    try {
      const res = await fetch(`/api/board?preset=${preset}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.pixels && data.pixels.length > 0) {
          data.pixels.forEach((p: Pixel) => {
            if (p.updatedAt) this.lastKnownTimestamps.set(`${preset}_${p.x}_${p.y}`, p.updatedAt);
          });
          return data.pixels;
        }
      }
    } catch (err) {
      // Local server unavailable -> Fall back to Cloud Firestore
    }

    const pixels = await this.fetchFromFirestore(preset);
    pixels.forEach(p => {
      if (p.updatedAt) this.lastKnownTimestamps.set(`${preset}_${p.x}_${p.y}`, p.updatedAt);
    });
    return pixels;
  }

  private async fetchFromFirestore(preset: BoardPreset): Promise<Pixel[]> {
    try {
      const res = await fetch(this.firestoreBaseUrl);

      // Handle 429 rate limiting with exponential backoff
      if (res.status === 429) {
        this.consecutiveErrors++;
        this.isRateLimited = true;
        const retryAfter = res.headers.get('Retry-After');
        if (retryAfter) {
          this.pollIntervalMs = Math.min(parseInt(retryAfter, 10) * 1000, this.MAX_POLL_MS);
        } else {
          this.pollIntervalMs = Math.min(this.MIN_POLL_MS * Math.pow(2, this.consecutiveErrors), this.MAX_POLL_MS);
        }
        console.warn(`Firestore 429 rate limited. Backing off to ${this.pollIntervalMs / 1000}s`);
        return [];
      }

      if (!res.ok) return [];

      // Success — reset backoff state
      this.consecutiveErrors = 0;
      this.isRateLimited = false;
      this.pollIntervalMs = this.MIN_POLL_MS;

      const data = await res.json();
      if (!data.documents) return [];

      return data.documents
        .map((doc: any) => {
          const fields = doc.fields || {};
          return {
            boardId: fields.boardId?.stringValue || '1080x1080',
            x: parseInt(fields.x?.integerValue || fields.x?.stringValue || '0', 10),
            y: parseInt(fields.y?.integerValue || fields.y?.stringValue || '0', 10),
            type: fields.type?.stringValue || 'letter',
            val: fields.val?.stringValue || '',
            textColor: fields.textColor?.stringValue || '#FFFFFF',
            bgColor: fields.bgColor?.stringValue || '#000000',
            updatedAt: parseInt(fields.updatedAt?.integerValue || '0', 10),
            lastAuthor: fields.lastAuthor?.stringValue || 'anon'
          } as Pixel;
        })
        .filter((p: Pixel) => (p.boardId || '1080x1080') === preset);
    } catch (err) {
      this.consecutiveErrors++;
      this.pollIntervalMs = Math.min(this.MIN_POLL_MS * Math.pow(2, this.consecutiveErrors), this.MAX_POLL_MS);
      console.warn('Failed to fetch pixels from Cloud Firestore', err);
      return [];
    }
  }

  public subscribeToCloudRealtime(preset: BoardPreset, onPixelUpdate: (pixel: Pixel) => void): () => void {
    let cancelled = false;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const poll = async () => {
      if (cancelled) return;

      try {
        const currentPixels = await this.fetchFromFirestore(preset);
        currentPixels.forEach(p => {
          const key = `${preset}_${p.x}_${p.y}`;
          const prevTs = this.lastKnownTimestamps.get(key) || 0;
          if (p.updatedAt && p.updatedAt > prevTs) {
            this.lastKnownTimestamps.set(key, p.updatedAt);
            onPixelUpdate(p);
          }
        });
      } catch (err) {
        // Silently handle poll errors — backoff already applied in fetchFromFirestore
      }

      // Schedule next poll using current (possibly backed-off) interval
      if (!cancelled) {
        timeoutId = setTimeout(poll, this.pollIntervalMs);
      }
    };

    // Initial poll after baseline delay
    timeoutId = setTimeout(poll, this.pollIntervalMs);

    return () => {
      cancelled = true;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }

  async savePixelToFirestore(pixel: Pixel): Promise<void> {
    const docId = `${pixel.boardId || '1080x1080'}_${pixel.x}_${pixel.y}`;
    const url = `${this.firestoreBaseUrl}/${docId}`;
    this.lastKnownTimestamps.set(`${pixel.boardId || '1080x1080'}_${pixel.x}_${pixel.y}`, pixel.updatedAt || Date.now());

    const payload = {
      fields: {
        boardId: { stringValue: pixel.boardId || '1080x1080' },
        x: { integerValue: pixel.x },
        y: { integerValue: pixel.y },
        type: { stringValue: pixel.type },
        val: { stringValue: pixel.val },
        textColor: { stringValue: pixel.textColor || '#FFFFFF' },
        bgColor: { stringValue: pixel.bgColor || '#000000' },
        updatedAt: { integerValue: pixel.updatedAt || Date.now() },
        lastAuthor: { stringValue: pixel.lastAuthor || 'anon' }
      }
    };

    try {
      await fetch(url, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } catch (err) {
      console.warn('Failed to save pixel edit to Cloud Firestore', err);
    }
  }

  async fetchSnapshotAt(timestamp: number, preset: BoardPreset = '1080x1080'): Promise<Pixel[]> {
    try {
      const res = await fetch(`/api/board/snapshot?timestamp=${timestamp}&preset=${preset}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success) return data.pixels || [];
      }
    } catch (err) {
      // Local server unavailable -> return filtered Firestore pixels
    }

    const all = await this.fetchFromFirestore(preset);
    return all.filter(p => (p.updatedAt || 0) <= timestamp);
  }
}
