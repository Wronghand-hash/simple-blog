/* eslint-disable prettier/prettier */
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SignupDto {
  @IsEmail()
  @IsNotEmpty({ message: 'لطفا ایمیل خود را وارد کنید' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'لطفا پسوورد خود را وارد کنید' })
  password: string;

  @IsString()
  @IsNotEmpty({ message: 'لطفا نام کاربری خود را وارد کنید' })
  username: string;
}
