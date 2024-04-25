import { Controller, Post, Body, Get, UseGuards, Param, Patch, Delete } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CompanyService } from './company.service';
import { companyData } from '../interface'

@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('create')
  create(@Body() data: companyData) {
    return this.companyService.create(data);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('check')
  check(@Body() data: companyData) {
    return this.companyService.check(data);
  }

  // @UseGuards(AuthGuard('jwt'))
  @Get('get/:id')
  get(@Param('id') id: number) {
    return this.companyService.get(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('get')
  getAll() {
    return this.companyService.getAll();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('getApprove')
  getApprove() {
    return this.companyService.getApprove();
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('update/:id')
  update(@Param('id') id: number, @Body() data: companyData) {
    return this.companyService.update(id, data);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('updateCompany/:id')
  updateCompany(@Param('id') id: number, @Body() data: { status: boolean, site_admin_email: string, site_admin_name: string, name: string, email: string }) {
    return this.companyService.updateCompany(id, data);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('remove/:id')
  remove(@Param('id') id: number, @Body() data: { site_admin_email: string, site_admin_name: string, name: string, email: string }) {
    return this.companyService.remove(id, data);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('getStuffs/:company_id')
  getStuffs(@Param('company_id') company_id: string, @Body() data: { limit: number, page: number} ) {
    return this.companyService.getStuffs(company_id, data);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('setBankAccount')
  setBankAccount(@Body() data: { company_id: string, bank_account: string }) {
    return this.companyService.setBankAccount(data.company_id, data.bank_account);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('getTransactions')
  getTransactions(@Body() data: { limit: number, start: string, direction: string, type: string }) {
    return this.companyService.getTransactions(data);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('getTransactionsByCompany')
  getTransactionsByCompany(@Body() data: { limit: number, start: string, direction: string, type: string, account: string }) {
    return this.companyService.getTransactionsByCompany(data);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('getRootAmount')
  getRootAmount(@Body() data: { type: string }) {
    return this.companyService.getRootAmount(data);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('getCompanyBalance')
  getCompanyBalance(@Body() data: { bank: string }) {
    return this.companyService.getCompanyBalance(data.bank);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('getTransactionInfo')
  getTransactionInfo(@Body() data: { type: string, id: string }) {
    return this.companyService.getTransactionInfo(data);
  }

}
