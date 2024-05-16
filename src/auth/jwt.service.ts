import * as jwt from 'jsonwebtoken';
import { default as config } from '../config';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '../../node_modules/@nestjs/mongoose';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class JWTService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createToken(email, roles) {
    const expiresIn = config.jwt.expiresIn,
      secretOrKey = config.jwt.secretOrKey;
    const userInfo = { email: email, roles: roles };
    const token = jwt.sign(userInfo, secretOrKey, { expiresIn });
    return {
      expires_in: expiresIn,
      access_token: token,
    };
  }

  async validateUser(signedUser): Promise<User> {
    var userFromDb = await this.userModel.findOne({ email: signedUser.email });
    if (userFromDb) {
      return userFromDb;
    }
    return null;
  }
}
