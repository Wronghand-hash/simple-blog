import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { LocalStrategy } from './strategies/authStrategy';
import { SessionSerializer } from './strategies/serializer/session.serializer';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule.register({ session: true }),
  ],
  controllers: [UsersController],
  providers: [UsersService, LocalStrategy, SessionSerializer],
})
export class UsersModule {}
