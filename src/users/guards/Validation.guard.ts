import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Blog } from 'src/blogs/entities/blog.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ValidationGuard implements CanActivate {
  constructor(
    @InjectRepository(Blog)
    private readonly blogRepository: Repository<Blog>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Check if user ID matches blog ID using TypeORM's findOne method
    let valid = false;
    const request = context.switchToHttp().getRequest();
    const userId = request.user.id;
    const blogId = request.params.id;
    if (blogId === userId) {
      valid = true;
    }
    return valid;
  }
}
