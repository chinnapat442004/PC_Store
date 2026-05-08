import { Injectable, UnauthorizedException } from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

import { UserService } from 'src/users/user.service';
import * as bcrypt from 'bcrypt';

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

    if (!user.is_active) {
      throw new UnauthorizedException('บัญชีของคุณถูกระงับการใช้งาน กรุณาติดต่อผู้ดูแลระบบ');
    }
    if (user.branch) {
      if (!user.branch.is_active)
        throw new UnauthorizedException('สาขาของคุณถูกปิดการใช้งาน กรุณาติดต่อผู้ดูแลระบบ')
    }





    if (user.role != 'customer') {
      const isMatch = await bcrypt.compare(pass, user.password);


      if (!isMatch) {
        throw new UnauthorizedException('Incorrect password');
      }
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
    const { password, ...rest } = createUserDto;

    const hash = await bcrypt.hash(password, 10);

    return this.usersService.registerCustomer({
      ...rest,
      password: hash,
    });
  }

  // async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
  //   return this.usersService.resetPassword(forgotPasswordDto);
  // }
}
