import { Controller, Post, Body, Get, UseGuards, Param, Patch, Delete } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { MachineService } from './machine.service';
import { machineData } from '../interface'

@Controller('machine')
export class MachineController {
  constructor(private readonly machineService: MachineService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('create')
  create(@Body() data: machineData) {
    return this.machineService.create(data);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('get/:id')
  get(@Param('id') id: string) {
    return this.machineService.get(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('getDop/:id')
  getDop(@Param('id') id: string) {
    return this.machineService.getDop(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('getDops/:project_id')
  getDops(@Param('project_id') project_id: string) {
    return this.machineService.getDops(project_id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('getDopCertificateNum/:company_id')
  getDopCertificateNum(@Param('company_id') company_id: string) {
    return this.machineService.getDopCertificateNum(company_id);
  }

  // @UseGuards(AuthGuard('jwt'))
  @Get('getAll/:project_id')
  getAll(@Param('project_id') project_id: number) {
    return this.machineService.getAll(project_id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('update/:id')
  update(@Param('id') id: number, @Body() data: machineData) {
    return this.machineService.update(id, data);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('remove/:id')
  remove(@Param('id') id: number) {
    return this.machineService.remove(id);
  }
}
