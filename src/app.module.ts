import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { BlogsModule } from './blogs/blogs.module';
import { UsersModule } from './users/users.module';
import { PassportModule } from '@nestjs/passport';
import { CacheModule } from '@nestjs/cache-manager';
import { BullModule } from '@nestjs/bull';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CacheModule.register({
      isGlobal: true,
      store: 'memory', // Use in-memory storage
      ttl: 60 * 60, // Set expiration time to 1 hour
    }),
    BullModule.forRoot({
      redis: {
        host: '172.17.0.2',
        port: 6379,
      },
    }),
    PassportModule,
    DatabaseModule,
    BlogsModule,
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
