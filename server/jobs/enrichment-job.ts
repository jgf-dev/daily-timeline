import type { TimestampedEvent } from "../../shared/models.js";
import { screenshotAnalyzer, transcriptionClient } from "../integrations/providers.js";

export async function runEnrichmentJob(events: TimestampedEvent[]): Promise<void> {
  await Promise.all(events.map(async (event) => {
    if (event.eventType === "voice") {
      await transcriptionClient.transcribeChunk(event.payload);
    }
    if (event.eventType === "activity") {
      await screenshotAnalyzer.analyze(event.payload);
    }
  }));
}
