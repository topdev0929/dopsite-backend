import { Module } from '@nestjs/common';
import { MachineService } from './machine.service';
import { machineProviders } from './machine.provider';
import { DatabaseModule } from '../../database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [MachineService, ...machineProviders],
  exports: [MachineService, ...machineProviders]
})
export class MachineModule {}
