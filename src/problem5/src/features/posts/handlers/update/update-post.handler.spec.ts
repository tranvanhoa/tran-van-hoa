import { Test, TestingModule } from '@nestjs/testing';
import { UpdatePostCommandHandler } from './update-post.handler';
import { PostRepository } from 'src/data/repositories/post.repository';
import { UpdatePostCommand } from './update-post.command';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { SuccessResponse } from 'src/core/interfaces/success.response';

describe('UpdatePostCommandHandler', () => {
  let handler: UpdatePostCommandHandler;
  let postRepository: PostRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdatePostCommandHandler,
        {
          provide: PostRepository,
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    handler = module.get<UpdatePostCommandHandler>(UpdatePostCommandHandler);
    postRepository = module.get<PostRepository>(PostRepository);
  });

  it('should throw NotFoundException if post is not found', async () => {
    jest.spyOn(postRepository, 'findOne').mockResolvedValue(null);

    const command = new UpdatePostCommand('slug', { title: 'New Title' }, 123);

    await expect(handler.execute(command)).rejects.toThrow(NotFoundException);
  });

  it('should throw ForbiddenException if user is not the creator of the post', async () => {
    jest
      .spyOn(postRepository, 'findOne')
      .mockResolvedValue({ creatorId: 456 } as any);

    const command = new UpdatePostCommand('slug', { title: 'New Title' }, 123);

    await expect(handler.execute(command)).rejects.toThrow(ForbiddenException);
  });

  it('should update the post title and description', async () => {
    const post = {
      creatorId: 123,
      title: 'Old Title',
      description: 'Old Description',
      save: jest.fn(),
    };
    jest.spyOn(postRepository, 'findOne').mockResolvedValue(post as any);

    const command = new UpdatePostCommand(
      'slug',
      { title: 'New Title', description: 'New Description' },
      123,
    );

    const result = await handler.execute(command);

    expect(post.title).toBe('New Title');
    expect(post.description).toBe('New Description');
    expect(post.save).toHaveBeenCalled();
    expect(result).toBeInstanceOf(SuccessResponse);
  });

  it('should retain the old title and description if new ones are not provided', async () => {
    const post = {
      creatorId: 123,
      title: 'Old Title',
      description: 'Old Description',
      save: jest.fn(),
    };
    jest.spyOn(postRepository, 'findOne').mockResolvedValue(post as any);

    const command = new UpdatePostCommand('slug', {}, 123);

    const result = await handler.execute(command);

    expect(post.title).toBe('Old Title');
    expect(post.description).toBe('Old Description');
    expect(post.save).toHaveBeenCalled();
    expect(result).toBeInstanceOf(SuccessResponse);
  });
});
