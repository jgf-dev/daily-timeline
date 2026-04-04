import type { EndOfDayReviewSession } from '@daily-timeline/domain';

export class ReviewSessionStore {
  private session: EndOfDayReviewSession | null = null;

  get(): EndOfDayReviewSession | null {
    return this.session;
  }

  set(session: EndOfDayReviewSession) {
    this.session = session;
    return this.session;
  }
}
