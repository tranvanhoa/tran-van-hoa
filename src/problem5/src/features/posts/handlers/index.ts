import { CreatePostCommandHandler } from './create/create-post.handler';
import { DeletePostCommandHandler } from './delete/delete-post.handler';
import { GetPostDetailHandler } from './detail/get-post-detail.handler';
import { GetPostsHandler } from './list/get-posts.handler';
import { UpdatePostCommandHandler } from './update/update-post.handler';

export const commandHandlers = [
  CreatePostCommandHandler,
  UpdatePostCommandHandler,
  DeletePostCommandHandler,
];
export const queryHandlers = [GetPostDetailHandler, GetPostsHandler];
