import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as config from 'config';
import * as cookieParser from 'cookie-parser';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/HttpExceptionFilter.filter';
import { PrismaService } from './prisma/prisma.service';
import { setupSwagger } from './utils';

dotenv.config({
  path: path.resolve(
    process.env.NODE_ENV === 'production'
      ? '.production.env'
      : process.env.NODE_ENV === 'stage'
      ? '.env'
      : '.development.env',
  ),
});

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // 어떤 decorator도 없는 property의 object 제외
      forbidNonWhitelisted: true, // 이상한걸 보내면 request를 막음
      transform: true, // 원하는 타입으로 변환
    }),
  );

  // Prisma
  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app); // enableShutdownHooks 에러 해결

  const PORT = process.env.SERVER_PORT || config.get('server').port; // PORT 설정
  setupSwagger(app); // Swagger 설정
  app.enableCors({
    origin: `${process.env.CLIENT_URL}:${process.env.CLIENT_PORT}`,
    credentials: true,
  }); // CORS 설정
  app.use(cookieParser()); // cookie parser 사용
  app.useGlobalFilters(new HttpExceptionFilter()); // 전역 예외 필터

  await app.listen(PORT);

  if (process.env.NODE_ENV === 'stage') {
    Logger.log(`Application running on port ${PORT}, http://localhost:${PORT}`);
  }
}
bootstrap();
