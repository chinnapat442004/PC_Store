import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../users/user.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async signIn(email: string, pass: string): Promise<{ access_token: string }> {
    const user = await this.usersService.findOneByEmail(email);

    if (user.password !== pass) {
      throw new UnauthorizedException('Incorrect password');
    } else {
      const payload = { sub: user.user_id, email: user.email };

      return {
        access_token: await this.jwtService.signAsync(payload),
      };
    }
  }
}
