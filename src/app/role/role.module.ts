import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { DatabaseModule } from '../../database/database.module';
import { roleProviders } from './role.provider';

@Module({
  imports: [DatabaseModule],
  providers: [RoleService, ...roleProviders],
  exports: [RoleService, ...roleProviders]
})

export class RoleModule {}
