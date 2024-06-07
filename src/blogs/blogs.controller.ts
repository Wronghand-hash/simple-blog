/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Session,
  UseGuards,
} from '@nestjs/common';
import { CreateBlogDto } from './dto/create-blog.dto';
import { BlogsService } from './blogs.service';
import { UpdateBlogDto } from './dto/update-blog-dto';
import { CreateCommenDto } from './dto/create-comment.dto';
import { AuthenticatedGuard } from '../users/guards/Authenticated.guard';

@Controller('blogs')
export class BlogsController {
  constructor(private readonly blogService: BlogsService) {}

  @Post('/create')
  @UseGuards(AuthenticatedGuard)
  async create(
    @Body() createBlogDto: CreateBlogDto,
    @Session() session: Record<string, any>,
  ) {
    console.log(session.passport.user);
    return this.blogService.createBlog(
      createBlogDto,
      session.passport.user.userId,
    );
  }

  @Get()
  @UseGuards(AuthenticatedGuard)
  async getBlogs() {
    return this.blogService.getBlogs();
  }

  @Get(':id')
  @UseGuards(AuthenticatedGuard)
  async getById(@Param('id') id: string) {
    return this.blogService.getBlogsById(+id);
  }

  @Get('detail/:id')
  @UseGuards(AuthenticatedGuard)
  async getByDetailId(
    @Param('id') id: string,
    @Session() session: Record<string, any>,
  ) {
    return this.blogService.getDetailById(+id, session.passport.user.userId);
  }

  @Patch(':id')
  @UseGuards(AuthenticatedGuard)
  async update(
    @Session() session: Record<string, any>,
    @Param('id') id: string,
    @Body() updateBlogDto: UpdateBlogDto,
  ) {
    return this.blogService.update(
      +id,
      updateBlogDto,
      session.passport.user.userId,
    );
  }

  @Delete(':id')
  @UseGuards(AuthenticatedGuard)
  async deleteBlog(
    @Session() session: Record<string, any>,
    @Param('id') id: string,
  ) {
    return this.blogService.deleteBlog(+id, session.passport.user.userId);
  }

  @Post('/comment/:id')
  @UseGuards(AuthenticatedGuard)
  async addComment(
    @Session() session: Record<string, any>,
    @Param('id') id: string,
    @Body() createCommentDto: CreateCommenDto,
  ) {
    return this.blogService.addComment(
      +id,
      createCommentDto,
      session.passport.user.userId,
    );
  }
}
