import { CreateTagDto } from './create-tag.dto';

export class CreateBlogDto {
  title: string;
  body: string;
  tags: CreateTagDto[];
}
