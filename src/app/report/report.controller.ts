import { Controller, Post, Body, Get, UseGuards, Param, Patch, Delete } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ReportService } from './report.service';
import { reportData } from '../interface'
import { integer } from 'aws-sdk/clients/cloudfront';

@Controller('report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('create')
  create(@Body() data: reportData) {
    return this.reportService.create(data);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('get/:id')
  get(@Param('id') id: number) {
    return this.reportService.get(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('getAll/:company_id')
  getAll(@Param('company_id') company_id: number, @Body() data: { limit: number, page: number}) {
    return this.reportService.getAll(company_id, data);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('getAllDahshboard/:company_id')
  getAllDahshboard(@Param('company_id') company_id: number, @Body() data: { limit: number, page: number}) {
    return this.reportService.getAllDahshboard(company_id, data);
  }

  // @UseGuards(AuthGuard('jwt'))
  @Post('getReportByUser')
  getReportByUser(@Body() data: { id: string }) {
    return this.reportService.getReportByUser(data.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('getUserById')
  getUserById(@Body() data: { id: integer }) {
    return this.reportService.getUserById(data.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('update/:id')
  update(@Param('id') id: number, @Body() data: reportData) {
    return this.reportService.update(id, data);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('remove/:id')
  remove(@Param('id') id: number) {
    return this.reportService.remove(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('sendReport')
  sendReport(@Body() data: any) {
    return this.reportService.sendReport(data);
  }

  @Post('getS3Image')
  getS3Image(@Body() data: any) {
    return this.reportService.getS3Image(data);
  }

  @Post('getS3ImagesWithSignature')
  getS3ImagesWithSignature(@Body() data: any) {
    return this.reportService.getS3ImagesWithSignature(data);
  }

  @Post('checkReportStatusById')
  checkReportStatusById(@Body() data: any) {
    return this.reportService.checkReportStatusById(data);
  }
  
}
