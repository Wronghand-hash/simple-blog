import { Inject, Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import { CreateBlogDto } from './dto/create-blog.dto';
import { Blog } from './entities/blog.entity';
import { UpdateBlogDto } from './dto/update-blog-dto';
import { CreateCommenDto } from './dto/create-comment.dto';
import { Comment } from './entities/comment.entity';
import { CreateTagDto } from './dto/create-tag.dto';
import { Tag } from './entities/tag.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { CACHE_MANAGER, CacheManagerOptions } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class BlogsService {
  constructor(
    @InjectQueue('mailService') private readonly mailService: Queue,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Blog)
    private readonly blogsRepository: Repository<Blog>,
    private readonly entityManager: EntityManager,
  ) {}

  // creating blog

  async createBlog(createBlogDto: CreateBlogDto, id: string) {
    console.log(id);

    const user = await this.userRepository.findOne({
      where: { id: Number(id) },
    });
    if (!user) {
      throw new Error('User not found');
    }

    const blog = new Blog({
      ...createBlogDto,
      comments: [],
      tags: [],
      user: user,
    });
    await this.entityManager.save(blog);
  }

  // getting all the blogs

  async getBlogs() {
    return this.blogsRepository.find();
  }

  // get blog info for listing page by id

  async getBlogsById(id: number) {
    const blog = await this.blogsRepository.findOne({
      where: { id },
      relations: { comments: true, tags: true, user: true },
    });

    let blogInfo = {
      title: blog.title,
      body: blog.body,
      creator: blog.user.username,
      createdAt: blog.createdAt,
      viewCount: blog.view,
      commentsLength: blog.comments.length,
    };

    return blogInfo;
  }

  // getting full blog detail *** counting views happens below

  async getDetailById(id: number, userId: number) {
    const blog = await this.blogsRepository.findOne({
      where: { id },
      relations: { comments: true, tags: true, user: true },
    });

    // storing user view as in-memory cache;

    const cacheKey = `post:${id}-user:${userId}`;
    const userHasViewed = await this.cacheManager.get(cacheKey);
    if (!userHasViewed) {
      blog.view++;
      await this.blogsRepository.save(blog);
      await this.cacheManager.set(cacheKey, true, 60 * 60);
    }

    return blog;
  }

  // updating blog information

  async update(id: number, updateBlogDto: UpdateBlogDto, userId: number) {
    const blog = await this.blogsRepository.findOne({
      where: {
        id: id,
      },
      relations: {
        comments: true,
        tags: true,
        user: true,
      },
    });
    console.log(blog);
    await this.entityManager.transaction(async (entityManager) => {
      if (blog.user.id !== userId) {
        throw new Error('not authorized');
      }
      blog.title = updateBlogDto.title;
      blog.body = updateBlogDto.body;
      await entityManager.save(blog);
    });
  }

  // remove blog

  async deleteBlog(id: number, userId: number) {
    await this.entityManager.transaction(async (entityManager) => {
      const blog = await this.blogsRepository.findOne({
        where: {
          id: id,
        },
        relations: {
          comments: true,
          tags: true,
          user: true,
        },
      });
      if (blog.user.id !== userId) {
        throw new Error('not authorized');
      }
      await this.blogsRepository.delete(id);
    });
  }

  // add comment to blog

  async addComment(
    id: number,
    createCommentDto: CreateCommenDto,
    userId: number,
  ) {
    const user = await this.userRepository.findOne({
      where: { id: Number(userId) },
    });
    if (!user) {
      throw new Error('User not found');
    }

    const blog = await this.blogsRepository.findOneBy({ id });
    console.log(userId);

    // queueing the message sending proccess

    await this.mailService.add(
      'mail-service',
      {
        blogTitle: blog.title,
      },
      {
        delay: 3000,
        lifo: true,
      },
    );

    const comment = new Comment({
      body: createCommentDto.body,
      blog: blog,
    });
    await this.entityManager.save(comment);
  }
}
