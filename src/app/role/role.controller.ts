import { Controller, Post, Body, Get, UseGuards, Param, Patch } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RoleService } from './role.service'

@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('create')
  create(@Body() data: { name: string }) {
    return this.roleService.create(data);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('get/:id')
  get(@Param('id') id: number) {
    return this.roleService.get(id);
  }

  @Get('get')
  getAll() {
    return this.roleService.getAll();
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.usersService.update(+id, updateUserDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.usersService.remove(+id);
  // }
}
