import { Module } from '@nestjs/common';
import { InvoiceHistoryService } from './invoice-history.service';
import { invoiceHistoryProviders } from './invoice-history.provider';
import { DatabaseModule } from '../../database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [InvoiceHistoryService, ...invoiceHistoryProviders],
  exports: [InvoiceHistoryService, ...invoiceHistoryProviders]
})
export class InvoiceHistoryModule {}
