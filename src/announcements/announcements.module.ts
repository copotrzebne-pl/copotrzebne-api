import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { PublicAnnouncement } from './models/public-announcement.model';
import { InternalAnnouncement } from './models/internal-announcement.model';
import { AnnouncementsService } from './services/announcements.service';
import { AnnouncementsController } from './controllers/announcements.controller';

@Module({
  imports: [SequelizeModule.forFeature([PublicAnnouncement, InternalAnnouncement])],
  providers: [AnnouncementsService],
  controllers: [AnnouncementsController],
})
export class AnnouncementsModule {}
