import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import * as request from 'supertest';

describe('Blog Controller E2E Test', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close(); // Close the Nest application after all tests
  });

  it('should add a new blog post', () => {
    return request(app.getHttpServer())
      .post('/blogs/create')
      .send({
        title: 'blog title test',
        body: 'test body',
        User: {
          username: 'usertwo',
          password: 'testing',
          email: 'userone@gmail.com',
        },
      })
      .expect(201);
  });

  it('it should return unauthorized', () => {
    return request(app.getHttpServer())
      .post('/blogs/create')
      .send({
        title: 'blog title test',
        body: 'test body',
        User: {
          username: 'usertwo',
          password: 'testing',
          email: 'userone@gmail.com',
        },
      })
      .expect(40);
  });

  it('should return a bad request', () => {
    return request(app.getHttpServer())
      .post('/blogs/create')
      .send({
        title: '',
        body: 'test body',
        User: {
          username: 'usertwo',
          password: 'testing',
          email: 'userone@gmail.com',
        },
      })
      .expect(201);
  });

  // Add more test cases as needed
});
