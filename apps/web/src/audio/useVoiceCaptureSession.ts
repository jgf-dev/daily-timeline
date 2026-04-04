import { useMemo, useState } from 'react';
import { VoiceCaptureClient, type CaptureState } from './voiceCaptureClient';

export function useVoiceCaptureSession() {
  const [captureState, setCaptureState] = useState<CaptureState>('idle');
  const [lastError, setLastError] = useState<string | null>(null);

  const client = useMemo(
    () =>
      new VoiceCaptureClient({
        sessionId: 'voice-session-1',
        deviceId: 'browser-default-mic',
        mode: 'continuous transcription'
      }),
    []
  );

  const startCapture = async () => {
    try {
      setLastError(null);
      await client.start();
      setCaptureState('recording');
    } catch (error) {
      setCaptureState('error');
      setLastError(error instanceof Error ? error.message : 'Failed to start capture');
    }
  };

  const stopCapture = async () => {
    try {
      setCaptureState('stopping');
      await client.submitFinalTranscript('final transcript', 0.89);
      await client.stop();
      setCaptureState('idle');
    } catch (error) {
      setCaptureState('error');
      setLastError(error instanceof Error ? error.message : 'Failed to stop capture');
    }
  };

  return {
    captureState,
    lastError,
    startCapture,
    stopCapture
  };
}
