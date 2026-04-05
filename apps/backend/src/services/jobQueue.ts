export type DeepSearchJob = {
  id: string;
  query: string;
  timelineEntryIds: string[];
  createdAt: string;
};

export class DeepSearchQueue {
  private readonly jobs: DeepSearchJob[] = [];

  enqueue(job: DeepSearchJob) {
    this.jobs.push(job);
    return job;
  }

  list(): DeepSearchJob[] {
    return [...this.jobs];
  }
}
