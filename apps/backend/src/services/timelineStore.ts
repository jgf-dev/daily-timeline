import type { TimelineEntry } from '@daily-timeline/domain';

export class TimelineStore {
  private readonly entries: TimelineEntry[] = [];

  ingest(entry: TimelineEntry) {
    this.entries.push(entry);
  }

  list(): TimelineEntry[] {
    return [...this.entries].sort((a, b) => a.timestamp.localeCompare(b.timestamp));
  }
}
