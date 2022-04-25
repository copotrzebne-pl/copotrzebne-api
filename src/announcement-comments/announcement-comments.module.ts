import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AnnouncementCommentsService } from './services/announcement-comments.service';
import { AnnouncementCommentsController } from './announcement-comments.controller';
import { AnnouncementComment } from './models/announcement-comment.model';
import { AnnouncementsService } from '../announcements/services/announcements.service';
import { PublicAnnouncement } from '../announcements/models/public-announcement.model';
import { InternalAnnouncement } from '../announcements/models/internal-announcement.model';

@Module({
  imports: [SequelizeModule.forFeature([AnnouncementComment, PublicAnnouncement, InternalAnnouncement])],
  providers: [AnnouncementCommentsService, AnnouncementsService],
  controllers: [AnnouncementCommentsController],
})
export class AnnouncementCommentsModule {}
