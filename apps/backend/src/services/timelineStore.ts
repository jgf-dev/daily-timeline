import type { TimelineEntry } from '@daily-timeline/domain';

export class TimelineStore {
  private readonly entries: TimelineEntry[] = [];

  ingest(entry: TimelineEntry) {
    const parsed = Date.parse(entry.timestamp);
    if (Number.isNaN(parsed)) {
      throw new Error('Invalid timeline entry timestamp');
    }
    this.entries.push({ ...entry, timestamp: new Date(parsed).toISOString() });
  }

  list(): TimelineEntry[] {
    return [...this.entries].sort(
      (a, b) => Date.parse(a.timestamp) - Date.parse(b.timestamp)
    );
  }
}
