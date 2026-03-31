import { z } from 'zod';

const configSchema = z.object({
  PORT: z.coerce.number().default(4000),
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']).default('info'),
  JWT_SECRET: z.string().min(16),
  TRANSCRIPTION_PROVIDER: z.enum(['openai', 'deepgram', 'assemblyai']).default('openai'),
  SEARCH_PROVIDER: z.enum(['none', 'tavily', 'pinecone']).default('none'),
  SCREENSHOT_OCR_PROVIDER: z.enum(['openai', 'aws-textract', 'google-vision']).default('openai')
});

export type ApiConfig = z.infer<typeof configSchema>;

export function readConfig(env: NodeJS.ProcessEnv): ApiConfig {
  return configSchema.parse(env);
}
