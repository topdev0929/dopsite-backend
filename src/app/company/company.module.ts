import { Module } from '@nestjs/common';
import { CompanyService } from './company.service';
import { companyProviders } from './company.provider';
import { DatabaseModule } from '../../database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [CompanyService, ...companyProviders],
  exports: [CompanyService, ...companyProviders]
})
export class CompanyModule {}
