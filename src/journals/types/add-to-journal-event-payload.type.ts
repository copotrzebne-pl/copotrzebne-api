import { Action } from './action.enum';

export type AddToJournalEventPayload = {
  userId: string;
  action: Action;
  details?: string;
  date: Date;
};
