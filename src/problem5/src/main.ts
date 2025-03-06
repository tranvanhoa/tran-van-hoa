import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { CustomHttpExceptionFilter } from './core/filters/custom-http-exception.filter';
import { appPort } from './app.config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { useContainer } from 'class-validator';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const httpAdapterHost = app.get(HttpAdapterHost);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );
  app.useGlobalFilters(new CustomHttpExceptionFilter(httpAdapterHost));
  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('Crude Server')
    .setDescription('Basic api')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  await app.listen(appPort ?? 3000);
}

bootstrap();
