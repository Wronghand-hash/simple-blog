import { CreateCommenDto } from './create-comment.dto';

export class UpdateBlogDto {
  title: string;
  body: string;

  comments: CreateCommenDto[];
}
