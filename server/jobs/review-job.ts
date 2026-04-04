import { appendInsight } from "../storage/repositories.js";

export function buildReviewInsight(sessionId: string, content: string) {
  return appendInsight({
    sessionId,
    createdAt: new Date().toISOString(),
    kind: "summary",
    content,
    sourceEventIds: []
  });
}
