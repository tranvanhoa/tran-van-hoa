/* eslint-disable @typescript-eslint/unbound-method */
import { TestingModule, Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { SuccessResponse } from 'src/core/interfaces/success.response';
import { PostRepository } from 'src/data/repositories/post.repository';
import { Like } from 'typeorm';
import { GetPostsHandler } from './get-posts.handler';
import { GetPostsQuery } from './get-posts.query';

describe('GetPostsHandler', () => {
  let handler: GetPostsHandler;
  let postRepository: PostRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetPostsHandler,
        {
          provide: getRepositoryToken(PostRepository),
          useValue: {
            findAndCount: jest.fn(),
          },
        },
      ],
    }).compile();

    handler = module.get<GetPostsHandler>(GetPostsHandler);
    postRepository = module.get<PostRepository>(
      getRepositoryToken(PostRepository),
    );
  });

  it('should handle query with all parameters', async () => {
    const mockPosts = [
      { id: 1, title: 'Test Post', slug: 'test-post', isPublished: true },
    ];
    const query = new GetPostsQuery({
      title: 'Test Post',
      isPublished: true,
      page: 1,
      limit: 10,
    });

    jest
      .spyOn(postRepository, 'findAndCount')
      .mockResolvedValue([mockPosts as any, 1]);

    const result = await handler.execute(query);

    expect(postRepository.findAndCount).toHaveBeenCalledWith({
      where: {
        slug: Like('%test-post%'),
        isPublished: true,
      },
      take: 10,
      skip: 0,
    });
    expect(result).toEqual(
      new SuccessResponse({
        page: 1,
        limit: 10,
        total: 1,
        items: mockPosts,
      }),
    );
  });

  it('should handle pagination correctly', async () => {
    const mockPosts = [
      { id: 2, title: 'Post 2', slug: 'post-2', isPublished: true },
    ];
    const query = new GetPostsQuery({
      page: 2,
      limit: 5,
    });

    jest
      .spyOn(postRepository, 'findAndCount')
      .mockResolvedValue([mockPosts as any, 6]);

    const result = await handler.execute(query);

    expect(postRepository.findAndCount).toHaveBeenCalledWith({
      where: {},
      take: 5,
      skip: 5,
    });
    expect(result).toEqual(
      new SuccessResponse({
        page: 2,
        limit: 5,
        total: 6,
        items: mockPosts,
      }),
    );
  });

  it('should handle empty search results', async () => {
    const query = new GetPostsQuery({
      title: 'Nonexistent',
      isPublished: true,
      page: 1,
      limit: 10,
    });

    jest.spyOn(postRepository, 'findAndCount').mockResolvedValue([[], 0]);

    const result = await handler.execute(query);

    expect(result).toEqual(
      new SuccessResponse({
        page: 1,
        limit: 10,
        total: 0,
        items: [],
      }),
    );
  });

  it('should apply title search with slugify', async () => {
    const query = new GetPostsQuery({
      title: 'Test & Post',
      page: 1,
      limit: 10,
    });
    const mockPosts = [
      { id: 1, title: 'Test & Post', slug: 'test-and-post', isPublished: true },
    ];

    jest
      .spyOn(postRepository, 'findAndCount')
      .mockResolvedValue([mockPosts as any, 1]);

    await handler.execute(query);

    expect(postRepository.findAndCount).toHaveBeenCalledWith({
      where: {
        slug: Like('%test-and-post%'),
      },
      take: 10,
      skip: 0,
    });
  });

  it('should handle null filters correctly', async () => {
    const query = new GetPostsQuery({
      page: 1,
      limit: 10,
    });
    const mockPosts = [
      { id: 1, title: 'Test', slug: 'test', isPublished: true },
    ];

    jest
      .spyOn(postRepository, 'findAndCount')
      .mockResolvedValue([mockPosts as any, 1]);

    await handler.execute(query);

    expect(postRepository.findAndCount).toHaveBeenCalledWith({
      where: {},
      take: 10,
      skip: 0,
    });
  });
});
