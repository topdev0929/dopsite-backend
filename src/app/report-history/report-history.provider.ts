import { Connection, Repository } from 'typeorm';
import { ReportHistory } from './report-history.entity';

export const reportHistoryProviders = [
  {
    provide: 'REPORT_HISTORY_REPOSITORY',
    useFactory: (connection: Connection) => connection.getRepository(ReportHistory),
    inject: ['DATABASE_CONNECTION'],
  },
];
