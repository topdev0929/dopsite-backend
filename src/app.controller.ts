import { Controller, Get, Post, Req, Res, UseGuards, Body, Param, Header, Response, StreamableFile, UseInterceptors, UploadedFile } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from './user/user.service';
import { AuthService } from './auth/auth.service';
const mysqldump = require('mysqldump');
const fs = require('fs')
import { createReadStream } from 'fs';
import { join, extname  } from 'path';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
require('dotenv').config();

@Controller()
export class AppController {

  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) { }

  @UseGuards(AuthGuard('jwt'))
  @Get('notificationSiteAdminData')
  async notificationSiteAdminData() {
    return await this.userService.notificationSiteAdminData();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('backup')
  async backup(
    @Response({ passthrough: true }) res,
  ): Promise<StreamableFile> {

    await mysqldump({
      connection: {
        host: 'localhost',
        user: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
      },
      dump: { schema: { table: { dropIfExist: true } } },
      dumpToFile: './dop_db.sql',
    });

    const file = await createReadStream(join(process.cwd(), `dop_db.sql`));
    res.set({
      'Content-Type': 'application/json',
      'Content-Disposition': `attachment; filename="dop_db.sql"`,
    });

    return new StreamableFile(file);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('img', {
    storage: diskStorage({
      destination: './public/company-logo'
      , filename: (req, file, cb) => {
        const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('')
        cb(null, `${randomName}${extname(file.originalname)}`)
      }
    })
  }))
  uploadFile(@UploadedFile() file) {
    return file;
  }

  @Post('delete')
  Delete(@Body() data: any) {
    fs.unlink(`./public/${data.url}`, function(err) {
      return err
    })
    return true
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('notificationCompanyAdminData/:company_id/:id')
  async notificationCompanyAdminData(@Param('company_id') company_id: string, @Param('id') id: number) {
    if (company_id !== 'no_company') {
      return await this.userService.notificationCompanyAdminData(company_id, id);
    } else {
      return []
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('notificationCompanyUserData/:id')
  async notificationCompanyUserData(@Param('id') id: number) {
    return await this.userService.notificationCompanyUserData(id);
  }

  @Get('verify-email/:token')
  async verifyEmail(@Param('token') token) {
    const result = await this.userService.checkToken(token)
    if (result.data) {
      const res = await this.authService.login(result.data)
      const temp = {
        data: result.data,
        message: result.message,
        success: result.success,
        access_token: res.access_token
      }
      return temp
    } else {
      return result
    }

  }

  @Post('send-email')
  sendEmail(@Body() Data: { email: string }) {
    const result = this.userService.sendEmail(Data.email)
    return result
  }

  @Post('change-pass')
  changePass(@Body() Data: { token: string }) {
    const result = this.userService.changePass(Data.token)
    return result
  }

  @Post('send-pass')
  sendPass(@Body() Data: { password: string, token: string, firstname: string, lastname: string }) {
    const result = this.userService.sendPass(Data)
    return result
  }

  @Post('getUserByToken')
  getUserByToken(@Body() Data: { token: string }) {
    const result = this.userService.getUserByToken(Data)
    return result
  }
}


