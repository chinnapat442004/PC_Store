import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../users/user.service';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async signIn(email: string, pass: string): Promise<any> {
    try {
      console.log(email);
      console.log(pass);

      const user = await this.usersService.findOneByEmail(email);
      console.log(user);

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      if (user.password !== pass) {
        throw new UnauthorizedException('Incorrect password');
      }

      const payload = { sub: user.user_id, email: user.email };
      const access_token = await this.jwtService.signAsync(payload);

      return { access_token, user };
    } catch (error) {
      throw new UnauthorizedException(error.message || 'Login failed');
    }
  }
}
