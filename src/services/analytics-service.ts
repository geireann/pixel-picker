export interface DeviceContext {
  deviceType: 'mobile' | 'tablet' | 'desktop';
  screenResolution: string;
  referrer: string;
  language: string;
  timeZone: string;
}

export interface PageViewEvent {
  path: string;
  title?: string;
  timestamp: string;
  deviceContext: DeviceContext;
}

export interface AnalyticsEvent {
  name: string;
  params?: Record<string, any>;
  timestamp: string;
  deviceContext: DeviceContext;
}

export function detectDeviceContext(): DeviceContext {
  const width = typeof window !== 'undefined' ? window.innerWidth : 1024;
  let deviceType: 'mobile' | 'tablet' | 'desktop' = 'desktop';

  if (width < 600) {
    deviceType = 'mobile';
  } else if (width < 1024) {
    deviceType = 'tablet';
  }

  const rawReferrer = typeof document !== 'undefined' && document.referrer ? document.referrer : '';
  const referrer = rawReferrer ? rawReferrer.replace(/^https?:\/\//, '').split('/')[0] : 'direct';

  const screenResolution = typeof window !== 'undefined' ? `${window.innerWidth}x${window.innerHeight}` : 'unknown';
  const language = typeof navigator !== 'undefined' ? navigator.language : 'en-US';
  const timeZone = typeof Intl !== 'undefined' && Intl.DateTimeFormat
    ? Intl.DateTimeFormat().resolvedOptions().timeZone
    : 'unknown';

  return {
    deviceType,
    screenResolution,
    referrer,
    language,
    timeZone,
  };
}

/**
 * Privacy-First Instrumented Analytics Service.
 * Posts real telemetry directly to Cloud Firestore (`pixelpicker_analytics`) on project `geireann`.
 * Zero tracking cookies, fully GDPR compliant.
 */
export class AnalyticsService {
  private lastTrackedPath: string | null = null;

  public trackPageView(path: string = window.location.pathname, title?: string): void {
    if (this.lastTrackedPath === path) return;

    this.lastTrackedPath = path;
    const deviceContext = detectDeviceContext();
    const pageView: PageViewEvent = {
      path,
      title: title || (typeof document !== 'undefined' ? document.title : 'Pixel Picker'),
      timestamp: new Date().toISOString(),
      deviceContext,
    };

    this.postToFirestore(pageView);
  }

  public trackEvent(name: string, params?: Record<string, any>): void {
    const deviceContext = detectDeviceContext();
    const event: AnalyticsEvent = {
      name,
      params,
      timestamp: new Date().toISOString(),
      deviceContext,
    };

    this.postToFirestoreEvent(event);
  }

  private async postToFirestore(pageView: PageViewEvent): Promise<void> {
    try {
      const firestoreUrl = 'https://firestore.googleapis.com/v1/projects/geireann/databases/(default)/documents/pixelpicker_analytics';
      const payload = {
        fields: {
          path: { stringValue: pageView.path },
          title: { stringValue: pageView.title || 'Pixel Picker' },
          deviceType: { stringValue: pageView.deviceContext.deviceType },
          screenResolution: { stringValue: pageView.deviceContext.screenResolution },
          referrer: { stringValue: pageView.deviceContext.referrer },
          language: { stringValue: pageView.deviceContext.language },
          timeZone: { stringValue: pageView.deviceContext.timeZone },
          timestamp: { stringValue: pageView.timestamp },
        },
      };

      if (typeof fetch !== 'undefined') {
        await fetch(firestoreUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }
    } catch (err) {
      // Non-blocking telemetry
    }
  }

  private async postToFirestoreEvent(event: AnalyticsEvent): Promise<void> {
    try {
      const firestoreUrl = 'https://firestore.googleapis.com/v1/projects/geireann/databases/(default)/documents/pixelpicker_events';
      const payload = {
        fields: {
          name: { stringValue: event.name },
          params: { stringValue: JSON.stringify(event.params || {}) },
          deviceType: { stringValue: event.deviceContext.deviceType },
          timestamp: { stringValue: event.timestamp },
        },
      };

      if (typeof fetch !== 'undefined') {
        await fetch(firestoreUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }
    } catch (err) {
      // Non-blocking telemetry
    }
  }
}

export const analyticsService = new AnalyticsService();
