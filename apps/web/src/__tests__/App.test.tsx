// @vitest-environment jsdom

import '@testing-library/jest-dom/vitest';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { App } from '../App';

describe('App component', () => {
  describe('page structure', () => {
    it('renders a main element with class "app-shell"', () => {
      const { container } = render(<App />);
      const main = container.querySelector('main.app-shell');
      expect(main).toBeInTheDocument();
    });

    it('renders the "Daily Timeline" heading', () => {
      render(<App />);
      expect(screen.getByRole('heading', { level: 1, name: /daily timeline/i })).toBeInTheDocument();
    });

    it('renders the subtitle paragraph', () => {
      render(<App />);
      expect(screen.getByText(/rolling canvas ui starter/i)).toBeInTheDocument();
    });

    it('renders a header element', () => {
      const { container } = render(<App />);
      expect(container.querySelector('header')).toBeInTheDocument();
    });
  });

  describe('TimelineEntry section', () => {
    it('renders a "TimelineEntry" section heading', () => {
      render(<App />);
      expect(screen.getByRole('heading', { level: 2, name: 'TimelineEntry' })).toBeInTheDocument();
    });

    it('renders a <pre> element with TimelineEntry JSON', () => {
      const { container } = render(<App />);
      const sections = container.querySelectorAll('section');
      const timelineSection = sections[0];
      expect(timelineSection).toBeDefined();
      const pre = timelineSection!.querySelector('pre');
      expect(pre).toBeInTheDocument();
    });

    it('TimelineEntry JSON includes expected id', () => {
      const { container } = render(<App />);
      const preContents = Array.from(container.querySelectorAll('pre')).map((p) => p.textContent ?? '');
      expect(preContents.some((text) => text.includes('"id": "entry-1"'))).toBe(true);
    });

    it('TimelineEntry JSON includes source "voice"', () => {
      const { container } = render(<App />);
      const preContents = Array.from(container.querySelectorAll('pre')).map((p) => p.textContent ?? '');
      expect(preContents.some((text) => text.includes('"source": "voice"'))).toBe(true);
    });

    it('TimelineEntry JSON includes tags', () => {
      const { container } = render(<App />);
      const preContents = Array.from(container.querySelectorAll('pre')).map((p) => p.textContent ?? '');
      expect(preContents.some((text) => text.includes('architecture') && text.includes('planning'))).toBe(true);
    });

    it('TimelineEntry JSON includes userId', () => {
      const { container } = render(<App />);
      const preContents = Array.from(container.querySelectorAll('pre')).map((p) => p.textContent ?? '');
      expect(preContents.some((text) => text.includes('"userId": "user-1"'))).toBe(true);
    });
  });

  describe('VoiceCaptureSession section', () => {
    it('renders a "VoiceCaptureSession" section heading', () => {
      render(<App />);
      expect(screen.getByRole('heading', { level: 2, name: 'VoiceCaptureSession' })).toBeInTheDocument();
    });

    it('VoiceCaptureSession JSON includes id and state', () => {
      const { container } = render(<App />);
      const preContents = Array.from(container.querySelectorAll('pre')).map((p) => p.textContent ?? '');
      expect(preContents.some((text) => text.includes('"id": "voice-session-1"'))).toBe(true);
      expect(preContents.some((text) => text.includes('"state": "capturing"'))).toBe(true);
    });

    it('VoiceCaptureSession JSON includes null endedAt', () => {
      const { container } = render(<App />);
      const preContents = Array.from(container.querySelectorAll('pre')).map((p) => p.textContent ?? '');
      expect(preContents.some((text) => text.includes('"endedAt": null'))).toBe(true);
    });

    it('VoiceCaptureSession JSON includes language "en-US"', () => {
      const { container } = render(<App />);
      const preContents = Array.from(container.querySelectorAll('pre')).map((p) => p.textContent ?? '');
      expect(preContents.some((text) => text.includes('"language": "en-US"'))).toBe(true);
    });
  });

  describe('Insight + DailyReviewSession section', () => {
    it('renders the "Insight + DailyReviewSession" section heading', () => {
      render(<App />);
      expect(screen.getByRole('heading', { level: 2, name: 'Insight + DailyReviewSession' })).toBeInTheDocument();
    });

    it('Insight JSON includes type "pattern" and confidence', () => {
      const { container } = render(<App />);
      const preContents = Array.from(container.querySelectorAll('pre')).map((p) => p.textContent ?? '');
      expect(preContents.some((text) => text.includes('"type": "pattern"'))).toBe(true);
      expect(preContents.some((text) => text.includes('"confidence": 0.91'))).toBe(true);
    });

    it('Insight JSON includes summary text', () => {
      const { container } = render(<App />);
      const preContents = Array.from(container.querySelectorAll('pre')).map((p) => p.textContent ?? '');
      expect(
        preContents.some((text) => text.includes('Planning work is concentrated in the first half of the day.'))
      ).toBe(true);
    });

    it('DailyReviewSession JSON includes status "in_progress"', () => {
      const { container } = render(<App />);
      const preContents = Array.from(container.querySelectorAll('pre')).map((p) => p.textContent ?? '');
      expect(preContents.some((text) => text.includes('"status": "in_progress"'))).toBe(true);
    });

    it('DailyReviewSession JSON includes null completedAt', () => {
      const { container } = render(<App />);
      const preContents = Array.from(container.querySelectorAll('pre')).map((p) => p.textContent ?? '');
      expect(preContents.some((text) => text.includes('"completedAt": null'))).toBe(true);
    });
  });

  describe('section count', () => {
    it('renders exactly three content sections', () => {
      const { container } = render(<App />);
      const sections = container.querySelectorAll('section');
      expect(sections).toHaveLength(3);
    });

    it('renders exactly three <pre> elements (one per section)', () => {
      const { container } = render(<App />);
      const pres = container.querySelectorAll('pre');
      expect(pres).toHaveLength(3);
    });
  });
});
