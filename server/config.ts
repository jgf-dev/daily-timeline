import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  PORT: z.coerce.number().default(3000),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  DATABASE_PATH: z.string().default("./data/daily-timeline.db"),
  TRANSCRIPTION_API_KEY: z.string().optional(),
  VOICE_CHAT_API_KEY: z.string().optional(),
  SCREENSHOT_ANALYSIS_API_KEY: z.string().optional(),
  IMAGE_GENERATION_API_KEY: z.string().optional(),
  TRANSCRIPTION_MODEL: z.string().default("whisper-1"),
  VOICE_CHAT_MODEL: z.string().default("gpt-realtime"),
  SCREENSHOT_MODEL: z.string().default("gpt-4.1-mini"),
  IMAGE_MODEL: z.string().default("gpt-image-1")
});

export const env = envSchema.parse(process.env);
