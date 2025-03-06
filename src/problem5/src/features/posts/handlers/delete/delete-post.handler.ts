import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BaseResponse } from 'src/core/interfaces/base.response';
import { SuccessResponse } from 'src/core/interfaces/success.response';
import { PostRepository } from 'src/data/repositories/post.repository';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { DeletePostCommand } from './delete-post.command';

@CommandHandler(DeletePostCommand)
export class DeletePostCommandHandler
  implements ICommandHandler<DeletePostCommand>
{
  constructor(private postRepository: PostRepository) {}

  async execute(command: DeletePostCommand): Promise<BaseResponse<any>> {
    const { slug, userId } = command;
    const post = await this.postRepository.findOne({ where: { slug } });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (post.creatorId != userId) {
      throw new ForbiddenException(
        'You dont have permission to delete this post',
      );
    }
    await post.remove();
    return new SuccessResponse(true);
  }
}
