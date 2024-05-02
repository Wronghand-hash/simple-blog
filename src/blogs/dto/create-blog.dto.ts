import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { CreateTagDto } from './create-tag.dto';

export class CreateBlogDto {
  @IsString()
  @IsNotEmpty({ message: 'عنوان را انتخاب کیند' })
  title: string;

  @IsString()
  @IsNotEmpty({ message: 'توضیحات مقاله را وارد کنید' })
  body: string;

  tags: CreateTagDto[];
}
