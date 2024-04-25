import { Module } from '@nestjs/common';
import { ReportHistoryService } from './report-history.service';
import { reportHistoryProviders } from './report-history.provider';
import { DatabaseModule } from '../../database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [ReportHistoryService, ...reportHistoryProviders],
  exports: [ReportHistoryService, ...reportHistoryProviders]
})
export class ReportHistoryModule {}
