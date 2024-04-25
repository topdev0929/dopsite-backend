import { Controller, Post, Body, Get, UseGuards, Param, Patch, Delete } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { NotificateInviteService } from './notificate-invite.service';

@Controller('notificateInvite')
export class NotificateInviteController {
  constructor(private readonly notificateInviteService: NotificateInviteService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('sendEmailToRequester')
  sendEmailToRequester(@Body() data: { company_id: string, inviter: number, requester_email: string, message: string, role_id: number}) {
    return this.notificateInviteService.sendEmailToRequester(data);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('requestCompanyFromRequester')
  requestCompanyFromRequester(@Body() data: { requester: number, requester_email: string, message: string, inviter_email: string }) {
    return this.notificateInviteService.sendEmailToInviter(data);
  }

  // @UseGuards(AuthGuard('jwt'))
  // @Get('get/:id')
  // get(@Param('id') id: number) {
  //   return this.notificateInviteService.get(id);
  // }

  // @UseGuards(AuthGuard('jwt'))
  // @Get('getAll/:project_id')
  // getAll(@Param('project_id') project_id: number) {
  //   return this.notificateInviteService.getAll(project_id);
  // }

  // @UseGuards(AuthGuard('jwt'))
  // @Post('update/:id')
  // update(@Param('id') id: number, @Body() data: machineData) {
  //   return this.notificateInviteService.update(id, data);
  // }

  // @UseGuards(AuthGuard('jwt'))
  // @Delete('remove/:id')
  // remove(@Param('id') id: number) {
  //   return this.notificateInviteService.remove(id);
  // }
}
