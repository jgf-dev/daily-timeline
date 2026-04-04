export type ProviderKey = 'speechToText' | 'search' | 'screenshotAnalysis' | 'imageGeneration';

export type ProviderSelection = {
  provider: string;
  model?: string;
  endpoint?: string;
  apiKeyEnvVar?: string;
};

export type ProviderConfig = Record<ProviderKey, ProviderSelection>;

export const defaultProviderConfig: ProviderConfig = {
  speechToText: {
    provider: 'openai',
    model: 'gpt-4o-mini-transcribe',
    apiKeyEnvVar: 'OPENAI_API_KEY'
  },
  search: {
    provider: 'perplexity',
    model: 'sonar-pro',
    apiKeyEnvVar: 'PERPLEXITY_API_KEY'
  },
  screenshotAnalysis: {
    provider: 'openai',
    model: 'gpt-4.1-mini',
    apiKeyEnvVar: 'OPENAI_API_KEY'
  },
  imageGeneration: {
    provider: 'openai',
    model: 'gpt-image-1',
    apiKeyEnvVar: 'OPENAI_API_KEY'
  }
};
