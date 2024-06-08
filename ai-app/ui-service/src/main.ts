import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app/app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: [
      'http://localhost:3002',
      'https://www.qa.accounts.thefinstreet.co.uk',
      'https://qa-accounts.thefinstreet.co.uk',
    ],
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'OPTIONS'],
    credentials: true,
  });
  const configService = app.get(ConfigService);
  const config = new DocumentBuilder()
    .setTitle('AI UI Service')
    .setDescription(
      'AI UI Service API gateway',
    )
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(configService.get<number>('PORT') || 8000);
}
bootstrap();
