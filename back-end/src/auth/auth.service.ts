import { Injectable, UnauthorizedException } from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { ForgotPasswordDto } from 'src/users/dto/forgot-password.dto';
import { UserService } from 'src/users/user.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) { }

  async signIn(email: string, pass: string) {
    const user = await this.usersService.findOneByEmail(email);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (user.password !== pass) {
      throw new UnauthorizedException('Incorrect password');
    }

    const payload = {
      sub: user.user_id,
      email: user.email,
      role: user.role,
      branch_id: user.branch?.branch_id,
    };

    const access_token = await this.jwtService.signAsync(payload);

    delete user.password;

    return { access_token, user };
  }

  async register(createUserDto: CreateUserDto) {
    return this.usersService.registerCustomer(createUserDto);
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    return this.usersService.resetPassword(forgotPasswordDto);
  }


}
