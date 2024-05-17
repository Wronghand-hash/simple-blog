import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { UsersService } from 'src/users/users.service';
import { Blog } from 'src/blogs/entities/blog.entity';
import { Tag } from 'src/blogs/entities/tag.entity';
import { User } from 'src/users/entities/user.entity';
import { ForgottenPassword } from './entities/forgottenPassword.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailVerification } from './entities/EmailVerification.entity';
import { ConsentRegistary } from './entities/consentRegistary.entity';
import { Comment } from 'src/blogs/entities/comment.entity';
import { JWTService } from './jwt.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Blog,
      Comment,
      Tag,
      User,
      ForgottenPassword,
      EmailVerification,
      ConsentRegistary,
    ]),
    UsersModule,
    HttpModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, UsersService, JWTService],
})
export class AuthModule {}
