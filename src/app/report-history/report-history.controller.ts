import { Controller, Post, Body, Get, UseGuards, Param } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ReportHistoryService } from './report-history.service';

@Controller('report-history')
export class ReportHistoryController {
  constructor(private readonly reportHistoryService: ReportHistoryService) {}

  @UseGuards(AuthGuard("jwt"))
  @Get("/company/:id")
  getAllReportsByCompany(@Param("id") id: string) {
    return this.reportHistoryService.getAllReportsByCompany(id);
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("/project/:id")
  getReportHistoryByProject(@Param("id") id: string) {
    return this.reportHistoryService.getReportHistoryByProject(id);
  }

  // @UseGuards(AuthGuard("jwt"))
  @Get("/by-id/:id")
  getReportHistoryById(@Param("id") id: string) {
    return this.reportHistoryService.getReportHistoryById(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('resend-report')
  resendReport(@Body() data: any) {
    return this.reportHistoryService.resendReport(data);
  }


}
