import { Module } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { customerProviders } from './customer.provider';
import { DatabaseModule } from '../../database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [CustomerService, ...customerProviders],
  exports: [CustomerService, ...customerProviders]
})
export class CustomerModule {}
