import { Test, TestingModule } from '@nestjs/testing';
import { GetPostDetailHandler } from './get-post-detail.handler';
import { PostRepository } from 'src/data/repositories/post.repository';
import { GetPostDetailQuery } from './get-post-detail.query';
import { NotFoundException } from '@nestjs/common';
import { PostRo } from '../../response-objects/post.ro';
import { SuccessResponse } from 'src/core/interfaces/success.response';

describe('GetPostDetailHandler', () => {
  let handler: GetPostDetailHandler;
  let repository: PostRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetPostDetailHandler,
        {
          provide: PostRepository,
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    handler = module.get<GetPostDetailHandler>(GetPostDetailHandler);
    repository = module.get<PostRepository>(PostRepository);
  });

  it('should return post details if post is found', async () => {
    const query = new GetPostDetailQuery('test-slug');
    const post = { id: 1, title: 'Test Post', slug: 'test-slug' } as PostRo;
    jest.spyOn(repository, 'findOne').mockResolvedValue(post as any);

    const result = await handler.execute(query);

    expect(result).toEqual(new SuccessResponse({ ...post }));
    expect(repository.findOne).toHaveBeenCalledWith({
      where: { slug: 'test-slug' },
    });
  });

  it('should throw NotFoundException if post is not found', async () => {
    const query = new GetPostDetailQuery('non-existent-slug');
    jest.spyOn(repository, 'findOne').mockResolvedValue(null);

    await expect(handler.execute(query)).rejects.toThrow(NotFoundException);
    expect(repository.findOne).toHaveBeenCalledWith({
      where: { slug: 'non-existent-slug' },
    });
  });
});
