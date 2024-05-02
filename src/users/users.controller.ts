import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { SignupDto } from './dto/signup.dto';
import { SigninDto } from './dto/signin.dto';
import { LocalAuthGuard } from './guards/AuthGuard.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}
  @Post('signup')
  signup(@Body() dto: SignupDto) {
    return this.userService.signup(dto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('signin')
  signIn(@Res({ passthrough: true }) res: Response, @Body() dto: SigninDto) {}
}
