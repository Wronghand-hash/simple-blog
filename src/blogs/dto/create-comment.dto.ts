import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCommenDto {
  @IsString()
  @IsNotEmpty({ message: 'کامنت خود را وارد کنید' })
  body: string;
}
