import { Module } from '@nestjs/common';
import { BlogsController } from './blogs.controller';
import { BlogsService } from './blogs.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Blog } from './entities/blog.entity';
import { Comment } from './entities/comment.entity';
import { Tag } from './entities/tag.entity';
import { UsersService } from '../users/users.service';
import { UsersModule } from '../users/users.module';
import { User } from '../users/entities/user.entity';
import { BullModule } from '@nestjs/bull';
import { userMailService } from './Mail.process';
import { ForgottenPassword } from 'src/auth/entities/forgottenPassword.entity';
import { EmailVerification } from 'src/auth/entities/EmailVerification.entity';
import { ConsentRegistary } from 'src/auth/entities/consentRegistary.entity';

// mailservice registered from bull module to be proccessed at src/blogs/mailproccess.ts

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
    BullModule.registerQueue({ name: 'mailService' }),
  ],
  controllers: [BlogsController],
  providers: [BlogsService, UsersModule, UsersService, userMailService],
})
export class BlogsModule {}
