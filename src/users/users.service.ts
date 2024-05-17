import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { SignupDto } from './dto/signup.dto';
import { User } from './entities/user.entity';
import * as argon from 'argon2';
import { EntityManager, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly entityManager: EntityManager,
  ) {}

  // user signup

  async signup(signupDto: SignupDto) {
    // generate the hash password
    const hash = await argon.hash(signupDto.password);
    try {
      const user = new User({
        ...signupDto,
        password: hash,
      });

      await this.entityManager.save(user);
      return user;
    } catch (error) {
      console.log(error);
    }
  }

  // set new password

  async setPassword(email: string, newPassword: string): Promise<boolean> {
    var userFromDb = await this.userRepository.findOne({
      where: {
        email: email,
      },
    });
    if (!userFromDb)
      throw new HttpException('LOGIN.USER_NOT_FOUND', HttpStatus.NOT_FOUND);

    userFromDb.password = await bcrypt.hash(newPassword);

    await this.entityManager.save(userFromDb);
    return true;
  }

  //user validation used in auth guard

  async validateUser(userName: string, password: string): Promise<any> {
    const user = await this.userRepository.findOne({
      where: {
        username: userName,
      },
    });
    const pwMatch = await argon.verify(user.password, password);
    if (!user) {
      throw new ForbiddenException('user doesnt exists');
    }
    if (user && pwMatch) {
      return {
        userId: user.id,
        username: user.username,
      };
    }
    return null;
  }
}
