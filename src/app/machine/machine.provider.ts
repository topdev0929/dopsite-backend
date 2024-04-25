import { Connection, Repository } from 'typeorm';
import { Machine } from './machine.entity';

export const machineProviders = [
  {
    provide: 'MACHINE_REPOSITORY',
    useFactory: (connection: Connection) => connection.getRepository(Machine),
    inject: ['DATABASE_CONNECTION'],
  },
];
