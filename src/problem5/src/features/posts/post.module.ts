import { Module } from '@nestjs/common';
import { DataModule } from 'src/data/data.module';
import { AuthModule } from '../auth/auth.module';
import { PostController } from './controllers/post.controller';
import { commandHandlers, queryHandlers } from './handlers';

@Module({
  imports: [DataModule, AuthModule],
  providers: [...queryHandlers, ...commandHandlers],
  controllers: [PostController],
})
export class PostModule {}
