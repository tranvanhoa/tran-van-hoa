import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BaseResponse } from 'src/core/interfaces/base.response';
import { SuccessResponse } from 'src/core/interfaces/success.response';
import { PostRo } from '../../response-objects/post.ro';
import { PostRepository } from 'src/data/repositories/post.repository';
import { UpdatePostCommand } from './update-post.command';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

@CommandHandler(UpdatePostCommand)
export class UpdatePostCommandHandler
  implements ICommandHandler<UpdatePostCommand>
{
  constructor(private postRepository: PostRepository) {}

  async execute(command: UpdatePostCommand): Promise<BaseResponse<PostRo>> {
    const { slug, dto, userId } = command;
    const post = await this.postRepository.findOne({ where: { slug } });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (post.creatorId != userId) {
      throw new ForbiddenException(
        'You dont have permission to modify this post',
      );
    }

    const { title, description } = dto;
    post.title = title ?? post.title;
    post.description = description ?? post.description;
    await post.save();
    return new SuccessResponse({
      ...post,
    });
  }
}
