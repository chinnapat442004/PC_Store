import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { AuthGuard } from '@nestjs/passport';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { ForgotPasswordDto } from 'src/users/dto/forgot-password.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { UserService } from 'src/users/user.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UserService
  ) { }


  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMe(@Req() req) {
    return this.usersService.findOne(req.user.user_id)
  }
  @UseGuards(AuthGuard('local'))
  @UseGuards(LocalAuthGuard)
  @Post('login')
  signIn(@Body() signInDto: Record<string, any>) {
    return this.authService.signIn(signInDto.email, signInDto.password);
  }

  @Post('register')
  register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @Post('forgot-password')
  forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto);
  }
}
