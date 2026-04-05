// @vitest-environment jsdom

import '@testing-library/jest-dom/vitest';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { App } from '../App';

describe('App component', () => {
  it('renders top-level heading', () => {
    render(<App />);
    expect(screen.getByRole('heading', { level: 1, name: /daily timeline/i })).toBeInTheDocument();
  });

  it('shows voice capture controls and visible state', () => {
    render(<App />);
    expect(screen.getByRole('heading', { level: 2, name: 'Voice Controls' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /start recording/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /stop recording/i })).toBeInTheDocument();
    expect(screen.getByText(/recording state: idle/i)).toBeInTheDocument();
  });

  it('renders timeline entry JSON with speech metadata', () => {
    const { container } = render(<App />);
    const preContents = Array.from(container.querySelectorAll('pre')).map((p) => p.textContent ?? '');

    expect(preContents.some((text) => text.includes('"source": "voice"'))).toBe(true);
    expect(preContents.some((text) => text.includes('"sessionId": "voice-session-1"'))).toBe(true);
    expect(preContents.some((text) => text.includes('"confidence": 0.94'))).toBe(true);
  });
});
