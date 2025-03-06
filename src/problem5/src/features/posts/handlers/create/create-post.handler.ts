import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BaseResponse } from 'src/core/interfaces/base.response';
import { SuccessResponse } from 'src/core/interfaces/success.response';
import { CreatePostCommand } from './create-post.command';
import { PostRo } from '../../response-objects/post.ro';
import { Post } from 'src/data/entities/post.entity';

@CommandHandler(CreatePostCommand)
export class CreatePostCommandHandler
  implements ICommandHandler<CreatePostCommand>
{
  constructor() {}

  async execute(command: CreatePostCommand): Promise<BaseResponse<PostRo>> {
    const { title, description } = command.dto;
    const newPost = new Post();
    newPost.title = title;
    newPost.description = description;
    newPost.creatorId = command.userId;

    await newPost.save();
    return new SuccessResponse({
      ...newPost,
    });
  }
}
