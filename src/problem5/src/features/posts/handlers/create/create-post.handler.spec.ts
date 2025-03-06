import { Test, TestingModule } from '@nestjs/testing';
import { CreatePostCommandHandler } from './create-post.handler';
import { CreatePostCommand } from './create-post.command';
import { Post } from 'src/data/entities/post.entity';
import { SuccessResponse } from 'src/core/interfaces/success.response';

describe('CreatePostCommandHandler', () => {
  let handler: CreatePostCommandHandler;
  let postSaveMock: jest.Mock;

  beforeEach(async () => {
    postSaveMock = jest.fn().mockResolvedValue(undefined);
    Post.prototype.save = postSaveMock;

    const module: TestingModule = await Test.createTestingModule({
      providers: [CreatePostCommandHandler],
    }).compile();

    handler = module.get<CreatePostCommandHandler>(CreatePostCommandHandler);
  });

  it('should be defined', () => {
    expect(handler).toBeDefined();
  });

  it('should create a new post', async () => {
    const command = new CreatePostCommand(
      { title: 'Test Title', description: 'Test Description' },
      123,
    );

    const result = await handler.execute(command);

    expect(postSaveMock).toHaveBeenCalled();
    expect(result).toBeInstanceOf(SuccessResponse);
    expect(result.data?.title).toBe('Test Title');
    expect(result.data?.description).toBe('Test Description');
  });
});
