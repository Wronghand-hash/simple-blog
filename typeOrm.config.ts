import { Blog } from 'src/blogs/entities/blog.entity';
import { Tag } from 'src/blogs/entities/tag.entity';
import { User } from 'src/users/entities/user.entity';
import { DataSource } from 'typeorm';

export default new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'wildlikegreez!',
  database: 'simpleBlog',
  entities: [User, Blog, Tag, Comment],
  synchronize: true,
  migrations: ['migrations/**'],
});
