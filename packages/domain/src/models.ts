export type TimelineEntryType = 'transcript' | 'screenshot' | 'insight' | 'correction';

export type TimelineEntry = {
  id: string;
  timestamp: string;
  type: TimelineEntryType;
  summary: string;
  transcriptSegmentId?: string;
  screenshotId?: string;
  insightId?: string;
  correctionId?: string;
  projectIds: string[];
  taskIds: string[];
  contextTagIds: string[];
};

export type TranscriptSegment = {
  id: string;
  source: 'microphone' | 'system-audio';
  text: string;
  startTime: string;
  endTime: string;
  confidence?: number;
  projectIds: string[];
  taskIds: string[];
  contextTagIds: string[];
};

export type Screenshot = {
  id: string;
  path: string;
  capturedAt: string;
  description?: string;
  ocrText?: string;
  projectIds: string[];
  taskIds: string[];
  contextTagIds: string[];
};

export type ContextTag = {
  id: string;
  label: string;
  kind: 'project' | 'task' | 'focus' | 'topic' | 'person';
};

export type Project = {
  id: string;
  name: string;
  status: 'active' | 'paused' | 'archived';
};

export type Task = {
  id: string;
  projectId: string;
  title: string;
  status: 'todo' | 'in-progress' | 'done' | 'blocked';
};

export type GeneratedInsight = {
  id: string;
  createdAt: string;
  type: 'summary' | 'follow-up' | 'risk' | 'next-step';
  content: string;
  timelineEntryIds: string[];
  confidence?: number;
};

export type ReviewCorrection = {
  id: string;
  createdAt: string;
  targetType: 'timeline-entry' | 'insight' | 'tag';
  targetId: string;
  reason: string;
  correctedValue: string;
};

export type EndOfDayReviewSession = {
  id: string;
  date: string;
  status: 'not-started' | 'in-progress' | 'completed';
  selectedEntryIds: string[];
  generatedInsightIds: string[];
  correctionIds: string[];
};
