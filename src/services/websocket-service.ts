import type { EditPixelPayload, BoardPreset } from '../types/pixel';

export type WebSocketListener = (event: { type: string; data: any }) => void;

export class WebSocketService {
  private ws: WebSocket | null = null;
  private listeners: Set<WebSocketListener> = new Set();
  private isConnected = false;
  private reconnectTimer: any = null;
  private currentPreset: BoardPreset = '1080x1080';

  constructor() {
    this.connect();
  }

  public setPreset(preset: BoardPreset) {
    this.currentPreset = preset;
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        type: 'JOIN_PRESET',
        data: { preset }
      }));
    }
  }

  private connect() {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.host;
    const wsUrl = `${protocol}//${host}/ws`;

    try {
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        this.isConnected = true;
        this.emit({ type: 'CONNECTED', data: {} });
        this.setPreset(this.currentPreset);
      };

      this.ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          this.emit(message);
        } catch (err) {
          console.error('WebSocket parse error:', err);
        }
      };

      this.ws.onclose = () => {
        this.isConnected = false;
        this.emit({ type: 'DISCONNECTED', data: {} });
        this.scheduleReconnect();
      };

      this.ws.onerror = (err) => {
        console.warn('WebSocket error:', err);
      };
    } catch (err) {
      this.scheduleReconnect();
    }
  }

  private scheduleReconnect() {
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    this.reconnectTimer = setTimeout(() => this.connect(), 2000);
  }

  public sendEdit(editPayload: EditPixelPayload) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        type: 'EDIT_PIXEL',
        data: {
          ...editPayload,
          boardId: editPayload.boardId || this.currentPreset
        }
      }));
    }
  }

  public subscribe(listener: WebSocketListener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private emit(event: { type: string; data: any }) {
    this.listeners.forEach(fn => fn(event));
  }
}
