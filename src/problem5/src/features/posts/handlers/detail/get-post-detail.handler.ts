import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetPostDetailQuery } from './get-post-detail.query';
import { BaseResponse } from 'src/core/interfaces/base.response';
import { PostRo } from '../../response-objects/post.ro';
import { PostRepository } from 'src/data/repositories/post.repository';
import { NotFoundException } from '@nestjs/common';
import { SuccessResponse } from 'src/core/interfaces/success.response';

@QueryHandler(GetPostDetailQuery)
export class GetPostDetailHandler implements IQueryHandler<GetPostDetailQuery> {
  constructor(private readonly postRepository: PostRepository) {}
  async execute(query: GetPostDetailQuery): Promise<BaseResponse<PostRo>> {
    const { slug } = query;
    const post = await this.postRepository.findOne({ where: { slug } });
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    return new SuccessResponse({ ...post });
  }
}
