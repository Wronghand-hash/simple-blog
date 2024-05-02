import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as session from 'express-session';
import * as passport from 'passport';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // initilizing swagger

  const config = new DocumentBuilder()
    .setTitle('blog example')
    .setDescription('The blog API description')
    .setVersion('1.0')
    .addTag('blogs')
    .setBasePath('/')
    .setExternalDoc('For more information', 'http://swagger.io')
    .addTag('blog', 'demonstration')
    .addTag('nestjs', 'framework')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.use(cookieParser());

  // redis storage can be specified with storage property
  app.use(
    session({
      secret: 'place_your_secret_code',
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: false,
        httpOnly: false,
        maxAge: 600000,
      },
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());
  await app.listen(3333);
}
bootstrap();
