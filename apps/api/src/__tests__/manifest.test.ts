import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const pkg = JSON.parse(
  readFileSync(resolve(__dirname, '../../package.json'), 'utf-8')
);

describe('apps/api package.json manifest', () => {
  describe('@daily-timeline/types dependency version', () => {
    it('pins @daily-timeline/types to the fixed version "0.1.0"', () => {
      expect(pkg.dependencies['@daily-timeline/types']).toBe('0.1.0');
    });

    it('does not use a workspace protocol reference for @daily-timeline/types', () => {
      const version = pkg.dependencies['@daily-timeline/types'];
      expect(version).not.toMatch(/^workspace:/);
    });

    it('does not use a wildcard (*) for @daily-timeline/types', () => {
      const version = pkg.dependencies['@daily-timeline/types'];
      expect(version).not.toBe('workspace:*');
      expect(version).not.toBe('*');
    });

    it('uses a valid semver string for @daily-timeline/types', () => {
      const version = pkg.dependencies['@daily-timeline/types'];
      // Matches bare semver like "0.1.0", optionally prefixed with ^ or ~
      expect(version).toMatch(/^[\^~]?\d+\.\d+\.\d+/);
    });
  });

  describe('dependencies object structure', () => {
    it('@daily-timeline/types is present in dependencies', () => {
      expect(pkg.dependencies).toHaveProperty('@daily-timeline/types');
    });

    it('fastify dependency is still present', () => {
      expect(pkg.dependencies).toHaveProperty('fastify');
    });

    it('zod dependency is still present', () => {
      expect(pkg.dependencies).toHaveProperty('zod');
    });
  });
});