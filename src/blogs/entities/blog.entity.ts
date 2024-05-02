import { AbstractEntity } from '../../database/abstract.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Comment } from './comment.entity';
import { Tag } from './tag.entity';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Blog extends AbstractEntity<Blog> {
  @Column()
  title: string;

  @Column()
  body: string;

  @ManyToOne(() => User, (user) => user.blogs)
  user: User;

  @OneToMany(() => Comment, (comment) => comment.blog, { cascade: true })
  comments: Comment[];

  @ManyToMany(() => Tag, { cascade: true })
  @JoinTable()
  tags: Tag[];

  @Column({ default: 0 })
  view: number;
}
