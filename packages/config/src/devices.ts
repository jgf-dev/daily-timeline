export type AudioDeviceConfig = {
  deviceId: string;
  label: string;
  role: 'microphone' | 'system-audio';
};

export type ScreenshotDeviceConfig = {
  mode: 'full-screen' | 'active-window' | 'region';
  intervalSeconds: number;
  retentionDays: number;
  localStoragePath: string;
};

export type LocalDeviceConfig = {
  audio: AudioDeviceConfig[];
  screenshot: ScreenshotDeviceConfig;
};

export const defaultLocalDeviceConfig: LocalDeviceConfig = {
  audio: [
    { deviceId: 'default-mic', label: 'Default Microphone', role: 'microphone' },
    { deviceId: 'default-loopback', label: 'System Loopback', role: 'system-audio' }
  ],
  screenshot: {
    mode: 'active-window',
    intervalSeconds: 30,
    retentionDays: 14,
    localStoragePath: './data/screenshots'
  }
};
