/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from '../users/entities/user.entity';
import { Blog } from '../blogs/entities/blog.entity';
import { Tag } from '../blogs/entities/tag.entity';
import { Comment } from '../blogs/entities/comment.entity';
import { EmailVerification } from 'src/auth/entities/EmailVerification.entity';
import { ForgottenPassword } from 'src/auth/entities/forgottenPassword.entity';
import { ConsentRegistary } from 'src/auth/entities/consentRegistary.entity';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        entities: [
          User,
          Blog,
          Tag,
          Comment,
          EmailVerification,
          ForgottenPassword,
          ConsentRegistary,
        ],
        synchronize: true,
        autoLoadEntities: true,
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
