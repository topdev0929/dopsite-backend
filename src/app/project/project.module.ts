import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { projectProviders } from './project.provider';
import { DatabaseModule } from '../../database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [ProjectService, ...projectProviders],
  exports: [ProjectService, ...projectProviders]
})
export class ProjectModule {}
