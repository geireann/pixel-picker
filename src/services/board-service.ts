import type { Pixel, BoardPreset } from '../types/pixel';

export interface IBoardService {
  fetchInitialBoard(preset?: BoardPreset): Promise<Pixel[]>;
  fetchSnapshotAt(timestamp: number, preset?: BoardPreset): Promise<Pixel[]>;
  savePixelToFirestore(pixel: Pixel): Promise<void>;
}

export class BoardService implements IBoardService {
  private firestoreBaseUrl = 'https://firestore.googleapis.com/v1/projects/geireann/databases/(default)/documents/pixels';

  async fetchInitialBoard(preset: BoardPreset = '1080x1080'): Promise<Pixel[]> {
    try {
      const res = await fetch(`/api/board?preset=${preset}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.pixels && data.pixels.length > 0) {
          return data.pixels;
        }
      }
    } catch (err) {
      // Local server unavailable -> Fall back to Cloud Firestore
    }

    return this.fetchFromFirestore(preset);
  }

  private async fetchFromFirestore(preset: BoardPreset): Promise<Pixel[]> {
    try {
      const res = await fetch(this.firestoreBaseUrl);
      if (!res.ok) return [];
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
      console.warn('Failed to fetch pixels from Cloud Firestore', err);
      return [];
    }
  }

  async savePixelToFirestore(pixel: Pixel): Promise<void> {
    const docId = `${pixel.boardId || '1080x1080'}_${pixel.x}_${pixel.y}`;
    const url = `${this.firestoreBaseUrl}/${docId}`;

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
