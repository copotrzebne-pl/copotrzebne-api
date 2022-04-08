import { Action } from './action.enum';

export type AddToJournalEventPayload = {
  user: string;
  action: Action;
  details?: string;
  date: Date;
};
