import { Module } from '@nestjs/common';
import { NotificateInviteService } from './notificate-invite.service';
import { NotificateInviteProviders } from './notificate-invite.provider';
import { DatabaseModule } from '../../database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [NotificateInviteService, ...NotificateInviteProviders],
  exports: [NotificateInviteService, ...NotificateInviteProviders]
})
export class NotificateInviteModule {}
