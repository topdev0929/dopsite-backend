import { Connection, Repository } from 'typeorm';
import { NotificateInvite } from './notificate-invite.entity';

export const NotificateInviteProviders = [
  {
    provide: 'NOTIFICATE_INVITE_REPOSITORY',
    useFactory: (connection: Connection) => connection.getRepository(NotificateInvite),
    inject: ['DATABASE_CONNECTION'],
  },
];
