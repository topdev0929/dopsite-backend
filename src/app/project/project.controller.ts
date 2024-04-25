import { Controller, Post, Body, Get, UseGuards, Param, Patch, Delete } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ProjectService } from './project.service';
import { projectData } from '../interface'

@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('create')
  create(@Body() data: projectData) {
    return this.projectService.create(data);
  }

  // @UseGuards(AuthGuard('jwt'))
  @Get('get/:id')
  get(@Param('id') id: number) {
    return this.projectService.get(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('getProject/:company_id')
  getAll(@Param('company_id') company_id: number, @Body() data: { limit: number, page: number})  {
    return this.projectService.getAll(company_id, data);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('getProjects/:customer_id')
  getAlls(@Param('customer_id') customer_id: string)  {
    return this.projectService.getAlls(customer_id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('update/:id')
  update(@Param('id') id: number, @Body() data: projectData) {
    return this.projectService.update(id, data);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('remove/:id')
  remove(@Param('id') id: number) {
    return this.projectService.remove(id);
  }
}

