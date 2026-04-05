import type { ScreenshotEvent } from '@daily-timeline/types';

const BRIDGE_EVENT = 'daily-timeline:screenshot';

export type ScreenshotBridgeHandler = (event: ScreenshotEvent) => void;

export function listenForScreenshotEvents(handler: ScreenshotBridgeHandler): () => void {
  const listener = (event: Event): void => {
    const custom = event as CustomEvent<ScreenshotEvent>;
    if (custom.detail) {
      handler(custom.detail);
    }
  };

  window.addEventListener(BRIDGE_EVENT, listener as EventListener);
  return () => window.removeEventListener(BRIDGE_EVENT, listener as EventListener);
}

export function emitScreenshotEvent(event: ScreenshotEvent): void {
  window.dispatchEvent(new CustomEvent<ScreenshotEvent>(BRIDGE_EVENT, { detail: event }));
}
