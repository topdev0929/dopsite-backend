import { Injectable, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { User } from '../user/user.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}
  async signIn(email: string, password: string): Promise<User> {
    const user = await this.userService.findByEmail(email);
    if (! user) {
      throw new BadRequestException('Not found that email. Use your precise email again.');
    }
    const matches: boolean = await bcrypt.compare(password, user.password);
    if (! matches) {
      throw new BadRequestException('Your password is wrong. If you forgot password, you can use Forgot password.');
    }
    delete user.password;
    return user;
  }

  async signUp(firstname: string, lastname: string, email: string, password: string): Promise<User> {
    const existing: any = await this.userService.findByEmail(email);

    if (existing && existing.verified) {
      throw new BadRequestException('This email is already registered. Please use other email.');
    }
    if (existing && !existing.verified) {
      return existing
    }
    const user: User = await this.userService.create(firstname, lastname, email, password);
    delete user.password;
    return user;
  }

  async login(user: User) {
    const payload = { firstname: user.firstname, lastname: user.lastname, email: user.email, sub: user.id, verified: user.verified, company_id: user.company_id, role_id: user.role_id, logo: user.logo, signature: user.signature, signature_logo: user.signature_logo, signature_level: user.signature_level };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

}
