import { Module } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { ProjectService } from '../project/project.service';
import { invoiceProviders } from './invoice.provider';
import { projectProviders } from '../project/project.provider';
import { DatabaseModule } from '../../database/database.module';
import {InvoiceHistoryModule} from '../invoice-history/invoice-history.module'
import { ReportModule } from '../report/report.module';
import { ReportHistoryModule } from '../report-history/report-history.module'

@Module({
  imports: [DatabaseModule, InvoiceHistoryModule, ReportModule, ReportHistoryModule],
  providers: [InvoiceService, ProjectService, ...invoiceProviders, ...projectProviders],
  exports: [InvoiceService, ...invoiceProviders]
})
export class InvoiceModule {}
