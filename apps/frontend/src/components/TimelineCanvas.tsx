import type { TimelineEntry } from '@daily-timeline/domain';

type TimelineCanvasProps = {
  entries: TimelineEntry[];
};

export function TimelineCanvas({ entries }: TimelineCanvasProps) {
  return (
    <section>
      <h1>Rolling Daily Timeline</h1>
      <p>Canvas-ready surface for incremental transcript + screenshot events.</p>
      <ul>
        {entries.map((entry) => (
          <li key={entry.id}>
            <strong>{entry.type}</strong> — {entry.summary}
          </li>
        ))}
      </ul>
    </section>
  );
}
