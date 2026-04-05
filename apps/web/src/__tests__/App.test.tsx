import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { App } from '../App';

describe('App component', () => {
  it('renders core headings', () => {
    render(<App />);
    expect(screen.getByRole('heading', { level: 1, name: /daily timeline/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: 'TimelineEntry' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: 'VoiceCaptureSession' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: 'ScreenshotEvent stream' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: 'Possible missed detail cards' })).toBeInTheDocument();
  });

  it('shows empty missed-detail placeholder by default', () => {
    render(<App />);
    expect(screen.getByText('No contradictions found yet.')).toBeInTheDocument();
  });

  it('renders starter voice timeline content in JSON preview', () => {
    const { container } = render(<App />);
    const preContents = Array.from(container.querySelectorAll('pre')).map((pre) => pre.textContent ?? '');
    expect(preContents.some((text) => text.includes('"source": "voice"'))).toBe(true);
    expect(preContents.some((text) => text.includes('"id": "voice-session-1"'))).toBe(true);
  });
});
