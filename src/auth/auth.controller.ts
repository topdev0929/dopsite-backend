import { Controller, Post, UseGuards, Req, Param, Body, Get } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { User } from '../user/user.entity';
import { createToken } from '../utils/common'
import { userData } from '../app/interface'

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService
    ) { }

  @UseGuards(AuthGuard('local-sign-up'))
  @Post('sign-up')
  async signUp(@Req() req: Request) {
    const token = createToken();
    const response = this.userService.verifyUser(req.user, token, req.body.company_id);
    return response
  }

  @UseGuards(AuthGuard('local-sign-in'))
  @Post('sign-in')
  async login(@Req() req: Request) {
    return this.authService.login(req.user as User);
  }


  @UseGuards(AuthGuard('jwt'))
  @Post('outUser')
  async outUser(@Body() data: {id: number}) {
    return this.userService.outUser(data.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('getAllStuffsNotImported')
  async getAllStuffsNotImported() {
    return this.userService.getAllStuffsNotImported();
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('addUserToCompany')
  async addUserToCompany(@Body() data: {id: number, company_id: string}) {
    return this.userService.addUserToCompany(data);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('changeUserRole')
  async changeUserRole(@Body() data: {id: number, role_id: number}) {
    return this.userService.changeUserRole(data);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('changeUserProfile')
  async changeUserProfile(@Body() data: userData) {
    return this.userService.changeUserProfile(data);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('getUserCompanyInfo')
  async getUserCompanyInfo(@Body() data: { id: number }) {
    return this.userService.getUserCompanyInfo(data.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('joinToCompany')
  async joinToCompany(@Body() data: { id: number, company_id: string, notificate_id: number }) {
    return this.userService.joinToCompany(data.id, data.company_id, data.notificate_id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('joinToCompanyApprove')
  async joinToCompanyApprove(@Body() data: { id: number, company_id: string, notificate_id: number, requester_id: number }) {
    return this.userService.joinToCompanyApprove(data.id, data.company_id, data.notificate_id, data.requester_id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('getUsersByCompanyId/:company_id')
  async getUsersByCompanyId(@Param('company_id') company_id: string) {
    return this.userService.getUsersByCompanyId(company_id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('getAdmins')
  async getAdmins(@Body() data: { company_id: string }) {
    return this.userService.getAdmins(data.company_id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('delete')
  async delete(@Body() data: { id: number }) {
    return this.userService.delete(data.id);
  }

  @Post('getUser')
  async getUser(@Body() data: { id: number }) {
    return this.userService.getUser(data.id);
  }

}
