/* eslint-disable prettier/prettier */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { UsersService } from '../users.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UsersService) {
    super();
  }
  async validate(username: string, password: string): Promise<any> {
    const userName = username;

    // Attempt to validate the user's credentials using the injected UserService

    const user = await this.userService.validateUser(userName, password);

    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
