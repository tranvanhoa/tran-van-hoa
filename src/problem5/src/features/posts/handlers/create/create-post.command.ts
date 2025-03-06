import { CreatePostDto } from './create-post.dto';

export class CreatePostCommand {
  constructor(
    public readonly dto: CreatePostDto,
    public readonly userId: number,
  ) {}
}
