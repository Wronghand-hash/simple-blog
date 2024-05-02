import { AbstractEntity } from '../../database/abstract.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Blog } from './blog.entity';

@Entity()
export class Comment extends AbstractEntity<Comment> {
  @Column()
  body: string;

  @ManyToOne(() => Blog, (blog) => blog.comments)
  blog: Blog;
}
