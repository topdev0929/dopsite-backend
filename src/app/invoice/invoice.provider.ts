import { Connection, Repository } from 'typeorm';
import { Invoice } from './invoice.entity';

export const invoiceProviders = [
  {
    provide: 'INVOICE_REPOSITORY',
    useFactory: (connection: Connection) => connection.getRepository(Invoice),
    inject: ['DATABASE_CONNECTION'],
  },
];
