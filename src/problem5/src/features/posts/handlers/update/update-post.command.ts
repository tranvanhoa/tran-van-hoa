import { UpdatePostDto } from './update-post.dto';

export class UpdatePostCommand {
  constructor(
    public readonly slug: string,
    public readonly dto: UpdatePostDto,
    public readonly userId: number,
  ) {}
}
