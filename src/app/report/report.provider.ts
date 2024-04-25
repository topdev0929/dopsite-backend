import { Connection, Repository } from 'typeorm';
import { Report } from './report.entity';

export const reportProviders = [
  {
    provide: 'REPORT_REPOSITORY',
    useFactory: (connection: Connection) => connection.getRepository(Report),
    inject: ['DATABASE_CONNECTION'],
  },
];
