import { Connection, Repository } from 'typeorm';
import { Role } from './role.entity';

export const roleProviders = [
  {
    provide: 'ROLE_REPOSITORY',
    useFactory: (connection: Connection) => connection.getRepository(Role),
    inject: ['DATABASE_CONNECTION'],
  },
];
