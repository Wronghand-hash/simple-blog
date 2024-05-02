import { Blog } from '../../blogs/entities/blog.entity';
import { Comment } from '../../blogs/entities/comment.entity';
import { AbstractEntity } from '../../database/abstract.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User extends AbstractEntity<User> {
  @Column()
  username: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @OneToMany(() => Blog, (blog) => blog.user, { cascade: true })
  blogs: Blog[];
}
