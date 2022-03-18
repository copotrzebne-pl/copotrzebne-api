import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { AddCacheHeaderToResponseInterceptor } from './interceptors/cache-header.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  const configService: ConfigService = app.get(ConfigService);
  app.enableShutdownHooks();
  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix('api');
  app.useGlobalInterceptors(new AddCacheHeaderToResponseInterceptor());

  const config = new DocumentBuilder()
    .setTitle('Copotrzebne.pl API')
    .setDescription('Description of copotrzebne.pl API')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(configService.get<number>('PORT', 3000));
}
bootstrap();
