import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

// <-- FOR THIS APP MAKE SURE TO USE NODE 24 OR HIGHER DUE TO LATEST PACKAGE SUPPORT -->
// <-- IF YOU USE NVM YOU CAN JUST RUN THE COMMAND: nvm use 24 -->
// <-- MAKE SURE REDIS IS RUNNING, TO ENABLE THE APP TO RUN PROPERLY -->

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('API Documentation')
    .setDescription('Backend API for Test-nest Application')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'JWT-auth',
    )
    .build();

  const origins = process.env.CORS_ORIGINS?.split(',').map(origin => origin.trim()) || [];

  app.enableCors({
    origin: origins,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    allowedHeaders: 'Content-Type, Authorization',
  });

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const port = process.env.PORT || 3000;

  await app.listen(port, '0.0.0.0'); 

  // loggerService.log(
  //   `Application is running on: ${await app.getUrl()}`,
  //   'Bootstrap',
  // );
}
bootstrap();
