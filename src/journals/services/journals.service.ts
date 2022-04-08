import { Injectable } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { InjectModel } from '@nestjs/sequelize';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';

import { Journal } from '../models/journal.model';
import { JournalEvent } from '../models/journal-event.enum';
import { AddToJournalEventPayload } from '../types/add-to-journal-event-payload.type';

@Injectable()
export class JournalsService {
  constructor(
    private readonly sequelize: Sequelize,
    @InjectModel(Journal)
    private readonly journalModel: typeof Journal,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  public logInJournal(payload: Omit<AddToJournalEventPayload, 'date'>): void {
    this.eventEmitter.emit(JournalEvent.ADD_TO_JOURNAL, { ...payload, date: new Date() });
  }

  @OnEvent(JournalEvent.ADD_TO_JOURNAL)
  private async handleAddToJournalEvent(payload: AddToJournalEventPayload): Promise<void> {
    const { user, action, details, date } = payload;
    await this.journalModel.create({
      user,
      action,
      details,
      createdAt: date,
    });
  }
}
