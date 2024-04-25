import { createConnection } from 'typeorm';
import { User } from 'src/user/user.entity';
import { Company } from 'src/app/company/company.entity';
import { Customer } from 'src/app/customer/customer.entity';
import { Invoice } from 'src/app/invoice/invoice.entity';
import { InvoiceHistory } from 'src/app/invoice-history/invoice-history.entity';
import { ReportHistory } from 'src/app/report-history/report-history.entity';
import { Machine } from 'src/app/machine/machine.entity';
import { NotificateInvite } from 'src/app/notificate-invite/notificate-invite.entity';
import { Project } from 'src/app/project/project.entity';
import { Report } from 'src/app/report/report.entity';
import { Role } from 'src/app/role/role.entity';
require('dotenv').config();

export const databaseProviders = [
  {
    provide: 'DATABASE_CONNECTION',
    useFactory: async () => await createConnection({
      type: 'mysql',
      host: 'db',
      port: 3306,
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [
        User,
        Company,
        Customer,
        Invoice,
        InvoiceHistory,
        Machine,
        NotificateInvite,
        Project,
        Report,
        ReportHistory,
        Role
      ],
      synchronize: true,
    }),
  },
];
