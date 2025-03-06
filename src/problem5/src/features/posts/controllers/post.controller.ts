import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreatePostDto } from '../handlers/create/create-post.dto';
import { User } from 'src/core/decorators/user.decorator';
import {
  ApiBearerAuth,
  ApiExtraModels,
  ApiOperation,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/core/guards/jwt-auth.guard';
import { JwtPayload } from 'src/features/auth/jwt.strategy';
import { CreatePostCommand } from '../handlers/create/create-post.command';
import { GetPostDetailQuery } from '../handlers/detail/get-post-detail.query';
import { Public } from 'src/core/decorators/public.decorator';
import { BaseResponse } from 'src/core/interfaces/base.response';
import { PostRo } from '../response-objects/post.ro';
import { UpdatePostDto } from '../handlers/update/update-post.dto';
import { UpdatePostCommand } from '../handlers/update/update-post.command';
import { DeletePostCommand } from '../handlers/delete/delete-post.command';
import { GetPostsDto } from '../handlers/list/get-posts.dto';
import { PagingRo } from 'src/core/interfaces/response-objects/paging.ro';
import { GetPostsQuery } from '../handlers/list/get-posts.query';
import {
  CustomSwaggerApiResponse,
  CustomSwaggerPagingApiResponse,
} from 'src/core/decorators/swagger.decorator';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiExtraModels(BaseResponse, PagingRo, PostRo)
@Controller({ path: 'posts', version: '1' })
@ApiTags('Post')
export class PostController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @ApiOperation({
    summary: 'Create post',
    description: 'Create a new post',
  })
  @CustomSwaggerApiResponse(getSchemaPath(PostRo))
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @Post()
  async createPost(
    @Body() dto: CreatePostDto,
    @User() user: JwtPayload,
  ): Promise<BaseResponse<PostRo>> {
    return this.commandBus.execute(new CreatePostCommand(dto, user.id));
  }

  @ApiOperation({
    summary: 'Update post',
    description: 'Update a post',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 404,
    description: 'Post not found',
  })
  @CustomSwaggerApiResponse(getSchemaPath(PostRo))
  @Patch(':slug')
  async updatePost(
    @Param('slug') slug: string,
    @Body() dto: UpdatePostDto,
    @User() user: JwtPayload,
  ): Promise<BaseResponse<PostRo>> {
    return this.commandBus.execute(new UpdatePostCommand(slug, dto, user.id));
  }

  @ApiOperation({
    summary: 'Delete post',
    description: 'Delete a post',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 404,
    description: 'Post not found',
  })
  @Delete(':slug')
  async deletePost(
    @Param('slug') slug: string,
    @User() user: JwtPayload,
  ): Promise<BaseResponse<boolean>> {
    return this.commandBus.execute(new DeletePostCommand(slug, user.id));
  }

  @ApiOperation({
    summary: 'Get posts',
    description: 'Get list of posts',
  })
  @CustomSwaggerPagingApiResponse(getSchemaPath(PostRo))
  @Get()
  @Public()
  async getPosts(
    @Query() dto: GetPostsDto,
  ): Promise<BaseResponse<PagingRo<PostRo>>> {
    return this.queryBus.execute(new GetPostsQuery(dto));
  }

  @ApiOperation({
    summary: 'Get post detail',
    description: 'Get detail of a post',
  })
  @CustomSwaggerApiResponse(getSchemaPath(PostRo))
  @ApiResponse({
    status: 404,
    description: 'Post not found',
  })
  @Get(':slug')
  @Public()
  async getPostDetail(
    @Param('slug') slug: string,
  ): Promise<BaseResponse<PostRo>> {
    return this.queryBus.execute(new GetPostDetailQuery(slug));
  }
}
