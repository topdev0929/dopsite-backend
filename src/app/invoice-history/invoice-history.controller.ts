import { Controller, Post, Body, Get, UseGuards, Param, Patch, Delete } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { InvoiceHistoryService } from './invoice-history.service';

@Controller('invoice-history')
export class InvoiceHistoryController {
  constructor(private readonly invoiceHistoryService: InvoiceHistoryService) {}

  @Get(":id")
  getInvoiceHistoryById(@Param("id") id: string) {
    return this.invoiceHistoryService.getInvoiceHistoryById(id);
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("/company/:id")
  getAllInvoicesByCompany(@Param("id") id: string) {
    return this.invoiceHistoryService.getAllInvoicesByCompany(id);
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("/project/:id")
  getAllInvoicesByProject(@Param("id") id: string) {
    return this.invoiceHistoryService.getAllInvoicesByProject(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('resend-invoice')
  resendInvoice(@Body() data: any) {
    return this.invoiceHistoryService.resendInvoice(data.project_id);
  }



}
