import { PostRepository } from 'src/data/repositories/post.repository';
import { GetPostsQuery } from './get-posts.query';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { BaseResponse } from 'src/core/interfaces/base.response';
import { PagingRo } from 'src/core/interfaces/response-objects/paging.ro';
import { PostRo } from '../../response-objects/post.ro';
import slugify from 'slugify';
import { Like } from 'typeorm';
import { SuccessResponse } from 'src/core/interfaces/success.response';

@QueryHandler(GetPostsQuery)
export class GetPostsHandler implements IQueryHandler<GetPostsQuery> {
  constructor(private readonly postRepository: PostRepository) {}

  async execute(query: GetPostsQuery): Promise<BaseResponse<PagingRo<PostRo>>> {
    const { title, isPublished, page, limit } = query.dto;
    const titleSearchText = title ? slugify(title.toLowerCase()) : null;
    const skip = (page - 1) * limit;
    const [result, total] = await this.postRepository.findAndCount({
      where: {
        ...(titleSearchText && { slug: Like(`%${titleSearchText}%`) }),
        ...(isPublished != null && { isPublished }),
      },
      take: limit,
      skip,
    });
    return new SuccessResponse<PagingRo<PostRo>>({
      page,
      limit,
      total,
      items: result.map((p) => {
        return { ...p };
      }),
    });
  }
}
