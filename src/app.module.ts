import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { RoleController } from './app/role/role.controller';
import { RoleModule } from './app/role/role.module';
import { CustomerController } from './app/customer/customer.controller';
import { CustomerModule } from './app/customer/customer.module';
import { ProjectController } from './app/project/project.controller';
import { ProjectService } from './app/project/project.service';
import { InvoiceService } from './app/invoice/invoice.service';
import { ProjectModule } from './app/project/project.module';
import { MachineController } from './app/machine/machine.controller';
import { MachineModule } from './app/machine/machine.module';
import { ReportController } from './app/report/report.controller';
import { ReportHistoryController } from './app/report-history/report-history.controller';

import { ReportModule } from './app/report/report.module';
import { ReportHistoryModule } from './app/report-history/report-history.module'

import { InvoiceController } from './app/invoice/invoice.controller';
import { InvoiceModule } from './app/invoice/invoice.module';

import { InvoiceHistoryController } from './app/invoice-history/invoice-history.controller';
import { InvoiceHistoryModule } from './app/invoice-history/invoice-history.module';

import { CompanyController } from './app/company/company.controller';
import { CompanyModule } from './app/company/company.module';
import { ConfigModule } from '@nestjs/config';
import { NotificateInviteController } from './app/notificate-invite/notificate-invite.controller';
import { NotificateInviteModule } from './app/notificate-invite/notificate-invite.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';


@Module({
  imports: [
    ConfigModule.forRoot(),
    AuthModule,
    UserModule,
    RoleModule,
    CustomerModule,
    ProjectModule,
    MachineModule,
    ReportModule,
    ReportHistoryModule,
    InvoiceModule,
    InvoiceHistoryModule,
    CompanyModule,
    NotificateInviteModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
  ],
  controllers: [
    AppController,
    RoleController,
    CustomerController,
    ProjectController,
    MachineController,
    ReportController,
    ReportHistoryController,
    
    InvoiceController,
    InvoiceHistoryController,
    CompanyController,
    NotificateInviteController,
  ],
  providers: [AppService, ProjectService, InvoiceService],
})
export class AppModule {}
