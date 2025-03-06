import { Test, TestingModule } from '@nestjs/testing';
import { DeletePostCommandHandler } from './delete-post.handler';
import { PostRepository } from 'src/data/repositories/post.repository';
import { DeletePostCommand } from './delete-post.command';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { SuccessResponse } from 'src/core/interfaces/success.response';

describe('DeletePostCommandHandler', () => {
  let handler: DeletePostCommandHandler;
  let postRepository: PostRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeletePostCommandHandler,
        {
          provide: PostRepository,
          useValue: {
            findOne: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    handler = module.get<DeletePostCommandHandler>(DeletePostCommandHandler);
    postRepository = module.get<PostRepository>(PostRepository);
  });

  it('should throw NotFoundException if post does not exist', async () => {
    jest.spyOn(postRepository, 'findOne').mockResolvedValue(null);

    const command = new DeletePostCommand('non-existent-slug', 123);

    await expect(handler.execute(command)).rejects.toThrow(NotFoundException);
  });

  it('should throw ForbiddenException if user is not the creator of the post', async () => {
    const post = { creatorId: 456, remove: jest.fn() };
    jest.spyOn(postRepository, 'findOne').mockResolvedValue(post as any);

    const command = new DeletePostCommand('existing-slug', 123);

    await expect(handler.execute(command)).rejects.toThrow(ForbiddenException);
  });

  it('should delete the post if user is the creator', async () => {
    const post = { creatorId: 123, remove: jest.fn() };
    jest.spyOn(postRepository, 'findOne').mockResolvedValue(post as any);

    const command = new DeletePostCommand('existing-slug', 123);

    const result = await handler.execute(command);

    expect(post.remove).toHaveBeenCalled();
    expect(result).toEqual(new SuccessResponse(true));
  });
});
