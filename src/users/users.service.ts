import { ForbiddenException, Injectable } from '@nestjs/common';
import { SignupDto } from './dto/signup.dto';
import { User } from './entities/user.entity';
import * as argon from 'argon2';
import { EntityManager, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

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
    } catch (error) {
      console.log(error);
    }
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
