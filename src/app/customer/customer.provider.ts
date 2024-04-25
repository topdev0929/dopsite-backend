import { Connection, Repository } from 'typeorm';
import { Customer } from './customer.entity';

export const customerProviders = [
  {
    provide: 'CUSTOMER_REPOSITORY',
    useFactory: (connection: Connection) => connection.getRepository(Customer),
    inject: ['DATABASE_CONNECTION'],
  },
];
