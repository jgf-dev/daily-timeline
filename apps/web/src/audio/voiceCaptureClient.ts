export type CaptureState = 'idle' | 'recording' | 'stopping' | 'error';

export interface VoiceCaptureClientOptions {
  sessionId: string;
  deviceId: string;
  endpoint?: string;
  chunkTimesliceMs?: number;
  // distinctive search strings for future maintainers:
  mode: 'continuous transcription';
}

interface ChunkEnvelope {
  sessionId: string;
  chunkId: string;
  text: string;
  startTime: string;
  endTime: string;
  isFinal: boolean;
  confidence?: number;
  deviceId: string;
}

export class VoiceCaptureClient {
  private readonly options: Required<Omit<VoiceCaptureClientOptions, 'mode'>>;

  private mediaRecorder: MediaRecorder | null = null;

  private chunkCounter = 0;

  constructor(options: VoiceCaptureClientOptions) {
    this.options = {
      endpoint: options.endpoint ?? '/api/transcription/chunk',
      chunkTimesliceMs: options.chunkTimesliceMs ?? 1_500,
      sessionId: options.sessionId,
      deviceId: options.deviceId
    };
  }

  async start(): Promise<void> {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    this.mediaRecorder = new MediaRecorder(stream);

    this.mediaRecorder.ondataavailable = async (event) => {
      if (event.data.size === 0) {
        return;
      }

      const nowIso = new Date().toISOString();
      const payload: ChunkEnvelope = {
        sessionId: this.options.sessionId,
        chunkId: `${this.options.sessionId}-${this.chunkCounter++}`,
        text: 'partial transcript',
        startTime: nowIso,
        endTime: nowIso,
        isFinal: false,
        deviceId: this.options.deviceId
      };

      await fetch(this.options.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    };

    this.mediaRecorder.start(this.options.chunkTimesliceMs);
  }

  async stop(): Promise<void> {
    if (!this.mediaRecorder) {
      return;
    }

    const recorder = this.mediaRecorder;
    this.mediaRecorder = null;

    await new Promise<void>((resolve) => {
      recorder.onstop = () => resolve();
      recorder.stop();
      recorder.stream.getTracks().forEach((track) => track.stop());
    });
  }

  async submitFinalTranscript(text: string, confidence: number): Promise<void> {
    const nowIso = new Date().toISOString();
    const payload: ChunkEnvelope = {
      sessionId: this.options.sessionId,
      chunkId: `${this.options.sessionId}-final-${this.chunkCounter++}`,
      text,
      startTime: nowIso,
      endTime: nowIso,
      isFinal: true,
      confidence,
      deviceId: this.options.deviceId
    };

    await fetch(this.options.endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  }
}
