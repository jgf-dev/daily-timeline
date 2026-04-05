import { describe, it, expect } from 'vitest';
import { readConfig } from '../config';

const VALID_JWT_SECRET = 'super-secret-key-at-least-16-chars';

describe('readConfig', () => {
  describe('valid configurations', () => {
    it('parses a minimal config with only JWT_SECRET provided, using defaults for the rest', () => {
      const config = readConfig({ JWT_SECRET: VALID_JWT_SECRET });

      expect(config.PORT).toBe(4000);
      expect(config.LOG_LEVEL).toBe('info');
      expect(config.JWT_SECRET).toBe(VALID_JWT_SECRET);
      expect(config.TRANSCRIPTION_PROVIDER).toBe('openai');
      expect(config.SEARCH_PROVIDER).toBe('none');
      expect(config.SCREENSHOT_OCR_PROVIDER).toBe('openai');
    });

    it('parses a fully specified config', () => {
      const config = readConfig({
        PORT: '8080',
        LOG_LEVEL: 'debug',
        JWT_SECRET: VALID_JWT_SECRET,
        TRANSCRIPTION_PROVIDER: 'deepgram',
        SEARCH_PROVIDER: 'tavily',
        SCREENSHOT_OCR_PROVIDER: 'aws-textract',
      });

      expect(config.PORT).toBe(8080);
      expect(config.LOG_LEVEL).toBe('debug');
      expect(config.JWT_SECRET).toBe(VALID_JWT_SECRET);
      expect(config.TRANSCRIPTION_PROVIDER).toBe('deepgram');
      expect(config.SEARCH_PROVIDER).toBe('tavily');
      expect(config.SCREENSHOT_OCR_PROVIDER).toBe('aws-textract');
    });

    it('coerces PORT from string to number', () => {
      const config = readConfig({ JWT_SECRET: VALID_JWT_SECRET, PORT: '3000' });
      expect(config.PORT).toBe(3000);
      expect(typeof config.PORT).toBe('number');
    });

    it('coerces PORT when already a number-like string with leading zeros', () => {
      const config = readConfig({ JWT_SECRET: VALID_JWT_SECRET, PORT: '04000' });
      expect(config.PORT).toBe(4000);
    });

    it('accepts all valid LOG_LEVEL values', () => {
      const levels = ['fatal', 'error', 'warn', 'info', 'debug', 'trace'] as const;
      for (const level of levels) {
        const config = readConfig({ JWT_SECRET: VALID_JWT_SECRET, LOG_LEVEL: level });
        expect(config.LOG_LEVEL).toBe(level);
      }
    });

    it('accepts all valid TRANSCRIPTION_PROVIDER values', () => {
      const providers = ['openai', 'deepgram', 'assemblyai'] as const;
      for (const provider of providers) {
        const config = readConfig({ JWT_SECRET: VALID_JWT_SECRET, TRANSCRIPTION_PROVIDER: provider });
        expect(config.TRANSCRIPTION_PROVIDER).toBe(provider);
      }
    });

    it('accepts all valid SEARCH_PROVIDER values', () => {
      const providers = ['none', 'tavily', 'pinecone'] as const;
      for (const provider of providers) {
        const config = readConfig({ JWT_SECRET: VALID_JWT_SECRET, SEARCH_PROVIDER: provider });
        expect(config.SEARCH_PROVIDER).toBe(provider);
      }
    });

    it('accepts all valid SCREENSHOT_OCR_PROVIDER values', () => {
      const providers = ['openai', 'aws-textract', 'google-vision'] as const;
      for (const provider of providers) {
        const config = readConfig({ JWT_SECRET: VALID_JWT_SECRET, SCREENSHOT_OCR_PROVIDER: provider });
        expect(config.SCREENSHOT_OCR_PROVIDER).toBe(provider);
      }
    });

    it('accepts JWT_SECRET exactly 16 characters long (minimum length)', () => {
      const exactMinSecret = 'atLeastSixteenCh';
      expect(exactMinSecret.length).toBe(16);
      const config = readConfig({ JWT_SECRET: exactMinSecret });
      expect(config.JWT_SECRET).toBe(exactMinSecret);
    });

    it('accepts a long JWT_SECRET', () => {
      const longSecret = 'a'.repeat(128);
      const config = readConfig({ JWT_SECRET: longSecret });
      expect(config.JWT_SECRET).toBe(longSecret);
    });
  });

  describe('invalid configurations - throws on bad input', () => {
    it('throws when JWT_SECRET is missing', () => {
      expect(() => readConfig({})).toThrow();
    });

    it('throws when JWT_SECRET is undefined', () => {
      expect(() => readConfig({ JWT_SECRET: undefined })).toThrow();
    });

    it('throws when JWT_SECRET is shorter than 16 characters', () => {
      expect(() => readConfig({ JWT_SECRET: 'tooshort' })).toThrow();
    });

    it('throws when JWT_SECRET is exactly 15 characters (one below minimum)', () => {
      const almostSecret = 'a'.repeat(15);
      expect(() => readConfig({ JWT_SECRET: almostSecret })).toThrow();
    });

    it('throws when LOG_LEVEL is an invalid value', () => {
      expect(() =>
        readConfig({ JWT_SECRET: VALID_JWT_SECRET, LOG_LEVEL: 'verbose' })
      ).toThrow();
    });

    it('throws when TRANSCRIPTION_PROVIDER is an invalid value', () => {
      expect(() =>
        readConfig({ JWT_SECRET: VALID_JWT_SECRET, TRANSCRIPTION_PROVIDER: 'whisper' })
      ).toThrow();
    });

    it('throws when SEARCH_PROVIDER is an invalid value', () => {
      expect(() =>
        readConfig({ JWT_SECRET: VALID_JWT_SECRET, SEARCH_PROVIDER: 'elasticsearch' })
      ).toThrow();
    });

    it('throws when SCREENSHOT_OCR_PROVIDER is an invalid value', () => {
      expect(() =>
        readConfig({ JWT_SECRET: VALID_JWT_SECRET, SCREENSHOT_OCR_PROVIDER: 'tesseract' })
      ).toThrow();
    });

    it('throws when PORT is a non-numeric string', () => {
      expect(() =>
        readConfig({ JWT_SECRET: VALID_JWT_SECRET, PORT: 'not-a-port' })
      ).toThrow();
    });
  });

  describe('default values', () => {
    it('defaults PORT to 4000', () => {
      const config = readConfig({ JWT_SECRET: VALID_JWT_SECRET });
      expect(config.PORT).toBe(4000);
    });

    it('defaults LOG_LEVEL to "info"', () => {
      const config = readConfig({ JWT_SECRET: VALID_JWT_SECRET });
      expect(config.LOG_LEVEL).toBe('info');
    });

    it('defaults TRANSCRIPTION_PROVIDER to "openai"', () => {
      const config = readConfig({ JWT_SECRET: VALID_JWT_SECRET });
      expect(config.TRANSCRIPTION_PROVIDER).toBe('openai');
    });

    it('defaults SEARCH_PROVIDER to "none"', () => {
      const config = readConfig({ JWT_SECRET: VALID_JWT_SECRET });
      expect(config.SEARCH_PROVIDER).toBe('none');
    });

    it('defaults SCREENSHOT_OCR_PROVIDER to "openai"', () => {
      const config = readConfig({ JWT_SECRET: VALID_JWT_SECRET });
      expect(config.SCREENSHOT_OCR_PROVIDER).toBe('openai');
    });
  });
});