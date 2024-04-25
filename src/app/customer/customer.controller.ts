import { Controller, Post, Body, Get, UseGuards, Param, Patch, Delete } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CustomerService } from './customer.service';
import { customerData } from '../interface'

@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('create')
  create(@Body() data: customerData) {
    return this.customerService.create(data);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('get/:id/:company_id')
  get(@Param('id') id: string, @Param('company_id') company_id: string) {
    return this.customerService.get(id, company_id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('getCompany/:company_id')
  getAll(@Param('company_id') company_id: string, @Body() data: { limit: number, page: number}) {
    return this.customerService.getAll(company_id, data);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('getCompany/:company_id')
  getAllCompany(@Param('company_id') company_id: string) {
    return this.customerService.getAllCompany(company_id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('update/:id')
  update(@Param('id') id: number, @Body() data: customerData) {
    return this.customerService.update(id, data);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('remove/:id')
  remove(@Param('id') id: number) {
    return this.customerService.remove(id);
  }
}
