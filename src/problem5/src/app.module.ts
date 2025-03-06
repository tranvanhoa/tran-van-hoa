import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { DataModule } from './data/data.module';
import { AuthModule } from './features/auth/auth.module';
import { PostModule } from './features/posts/post.module';

@Module({
  imports: [CqrsModule.forRoot(), DataModule, AuthModule, PostModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
