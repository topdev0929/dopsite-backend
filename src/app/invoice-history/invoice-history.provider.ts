import { Connection, Repository } from 'typeorm';
import { InvoiceHistory } from './invoice-history.entity';

export const invoiceHistoryProviders = [
  {
    provide: 'INVOICE_HISOTRY_REPOSITORY',
    useFactory: (connection: Connection) => connection.getRepository(InvoiceHistory),
    inject: ['DATABASE_CONNECTION'],
  },
];
