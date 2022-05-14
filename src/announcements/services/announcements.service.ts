import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { PublicAnnouncement } from '../models/public-announcement.model';
import { InternalAnnouncement } from '../models/internal-announcement.model';
import { Transaction } from 'sequelize';
import { CreatePublicAnnouncementDto } from '../dto/create-public-announcement.dto';
import { CreateInternalAnnouncementDto } from '../dto/create-internal-announcement.dto';
import { UpdatePublicAnnouncementDto } from '../dto/update-public-announcement.dto';
import { UpdateInternalAnnouncementDto } from '../dto/update-internal-announcement.dto';
import NotFoundError from '../../error/not-found.error';
import { date } from '../../helpers/date-utils';

@Injectable()
export class AnnouncementsService {
  constructor(
    @InjectModel(PublicAnnouncement)
    private readonly publicAnnouncementModel: typeof PublicAnnouncement,
    @InjectModel(InternalAnnouncement)
    private readonly internalAnnouncementModel: typeof InternalAnnouncement,
  ) {}

  public async getPublicAnnouncementById(transaction: Transaction, id: string): Promise<PublicAnnouncement | null> {
    return await this.publicAnnouncementModel.findByPk(id, { transaction });
  }

  public async getInternalAnnouncementById(transaction: Transaction, id: string): Promise<InternalAnnouncement | null> {
    return await this.internalAnnouncementModel.findByPk(id, { transaction });
  }

  public async getPublicAnnouncements(transaction: Transaction): Promise<PublicAnnouncement[]> {
    return await this.publicAnnouncementModel.findAll({ transaction });
  }

  public async getInternalAnnouncements(transaction: Transaction): Promise<InternalAnnouncement[]> {
    return await this.internalAnnouncementModel.findAll({ transaction });
  }

  public async getActiveInternalAnnouncements(transaction: Transaction): Promise<InternalAnnouncement[]> {
    const announcements = await this.internalAnnouncementModel.findAll({ transaction });
    const now = new Date();
    return announcements.filter((announcement) => {
      const { startDate, endDate } = announcement;

      if (!startDate && !endDate) {
        return true;
      }

      if (!startDate && endDate) {
        return date(now).earlierThan(endDate);
      }

      if (!endDate && startDate) {
        return date(now).laterThanOrEquals(startDate);
      }

      if (startDate && endDate) {
        return date(now).laterThanOrEquals(startDate) && date(now).earlierThan(endDate);
      }

      return false;
    });
  }

  public async createPublicAnnouncement(
    transaction: Transaction,
    publicAnnouncementDto: CreatePublicAnnouncementDto,
  ): Promise<PublicAnnouncement | null> {
    const announcement = await this.publicAnnouncementModel.create({ ...publicAnnouncementDto }, { transaction });
    return this.getPublicAnnouncementById(transaction, announcement.id);
  }

  public async createInternalAnnouncement(
    transaction: Transaction,
    internalAnnouncementDto: CreateInternalAnnouncementDto,
  ): Promise<InternalAnnouncement | null> {
    const announcement = await this.internalAnnouncementModel.create({ ...internalAnnouncementDto }, { transaction });
    return this.getInternalAnnouncementById(transaction, announcement.id);
  }

  public async updatePublicAnnouncement(
    transaction: Transaction,
    id: string,
    publicAnnouncementDto: UpdatePublicAnnouncementDto,
  ): Promise<PublicAnnouncement | null> {
    await this.publicAnnouncementModel.update({ ...publicAnnouncementDto }, { where: { id }, transaction });
    return await this.getPublicAnnouncementById(transaction, id);
  }

  public async updateInternalAnnouncement(
    transaction: Transaction,
    id: string,
    publicAnnouncementDto: UpdateInternalAnnouncementDto,
  ): Promise<InternalAnnouncement | null> {
    await this.internalAnnouncementModel.update({ ...publicAnnouncementDto }, { where: { id }, transaction });
    return await this.getInternalAnnouncementById(transaction, id);
  }

  public async deletePublicAnnouncement(transaction: Transaction, id: string): Promise<void> {
    const announcement = await this.getPublicAnnouncementById(transaction, id);

    if (!announcement) {
      throw new NotFoundError('PUBLIC_ANNOUNCEMENT_NOT_FOUND');
    }

    await announcement.destroy({ transaction });
  }

  public async deleteInternalAnnouncement(transaction: Transaction, id: string): Promise<void> {
    const announcement = await this.getInternalAnnouncementById(transaction, id);

    if (!announcement) {
      throw new NotFoundError('INTERNAL_ANNOUNCEMENT_NOT_FOUND');
    }

    await announcement.destroy({ transaction });
  }
}
