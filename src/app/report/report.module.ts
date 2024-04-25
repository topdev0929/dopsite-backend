import { Module } from '@nestjs/common';
import { ReportService } from './report.service';
import { reportProviders } from './report.provider';
import { DatabaseModule } from '../../database/database.module';
import {ReportHistoryModule} from '../report-history/report-history.module'

@Module({
  imports: [DatabaseModule, ReportHistoryModule],
  providers: [ReportService, ...reportProviders],
  exports: [ReportService, ...reportProviders]
})
export class ReportModule {}
