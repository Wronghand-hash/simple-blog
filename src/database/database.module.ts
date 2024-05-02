import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from '../users/entities/user.entity';
import { Blog } from '../blogs/entities/blog.entity';
import { Tag } from '../blogs/entities/tag.entity';
import { Comment } from '../blogs/entities/comment.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: 'your_db_host',
        port: 5432,
        username: 'postgres',
        password: 'your_db_password',
        database: 'your_db_name',
        entities: [User, Blog, Tag, Comment],
        synchronize: true,
        autoLoadEntities: true,
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
