import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { repositories } from './repositories';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      synchronize: true,
      entities: [__dirname + '/entities/*{.ts,.js}'],
    }),
  ],
  providers: [...repositories],
  exports: [...repositories],
})
export class DataModule {}
