import { env } from "../config.js";

type ProviderPayload = Record<string, unknown>;

function createStub(name: string, apiKey?: string) {
  return {
    async call(payload: ProviderPayload) {
      return { provider: name, configured: Boolean(apiKey), payload };
    }
  };
}

const transcription = createStub("transcription", env.TRANSCRIPTION_API_KEY);
const voice = createStub("voice_chat", env.VOICE_CHAT_API_KEY);
const screenshot = createStub("screenshot_analysis", env.SCREENSHOT_ANALYSIS_API_KEY);
const image = createStub("image_generation", env.IMAGE_GENERATION_API_KEY);

export const transcriptionClient = {
  transcribeChunk(payload: ProviderPayload) {
    return transcription.call(payload);
  }
};

export const voiceChatClient = {
  sendMessage(payload: ProviderPayload) {
    return voice.call(payload);
  }
};

export const screenshotAnalyzer = {
  analyze(payload: ProviderPayload) {
    return screenshot.call(payload);
  }
};

export const imageGenerator = {
  render(payload: ProviderPayload) {
    return image.call(payload);
  }
};
