import { Injectable, UnauthorizedException } from '@nestjs/common'
import { UserService } from '../users/user.service'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) { }

  async signIn(email: string, pass: string) {
    const user = await this.usersService.findOneByEmail(email)

    if (!user) {
      throw new UnauthorizedException('User not found')
    }

    if (user.password !== pass) {
      throw new UnauthorizedException('Incorrect password')
    }

    const payload = {
      sub: user.user_id,
      email: user.email,
      role: user.role,
      branch_id: user.branch?.branch_id,
    }

    const access_token = await this.jwtService.signAsync(payload)

    return { access_token, user }
  }
}