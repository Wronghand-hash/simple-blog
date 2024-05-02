import { IsNotEmpty, IsString } from 'class-validator';
import { CreateCommenDto } from './create-comment.dto';

export class UpdateBlogDto {
  @IsString()
  @IsNotEmpty({ message: 'عنوان مقاله را وارد کنید' })
  title: string;

  @IsString()
  @IsNotEmpty({ message: 'توضیحات مقاله را وارد کنید' })
  body: string;

  comments: CreateCommenDto[];
}
