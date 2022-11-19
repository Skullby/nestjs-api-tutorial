import { INestApplication, ValidationPipe } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { PrismaService } from "../src/prisma/prisma.service";
import { AppModule } from "../src/app.module";
import * as pactum from 'pactum';
import { AuthDto } from "src/auth/dto";
import { EditUserDto } from "../src/user/dto";
import { CreateBookmarkDto } from '../src/bookmark/dto/create-bookmark.dto';

describe('App e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
    }));
    await app.init();
    await app.listen(3333);

    prisma = app.get(PrismaService);

    await prisma.cleanDB();
    
    pactum.request.setBaseUrl('http://localhost:3333')
  });

  afterAll(() => {
    app.close();
  })
 

  describe('Auth', () => {
    const dto: AuthDto = {
    email: 'vlad@gmail.com',
    password: '123',
  }
    describe('Signup', () => {
      it('should throw an exception if email empty', () => {
        return pactum
        .spec()
        .post('/signup')
        .withBody({
          password: dto.password,
        })
        .expectStatus(400)
      })
      it('should throw an exception if password empty', () => {
        return pactum
        .spec()
        .post('/signup')
        .withBody({
          email: dto.email,
        })
        .expectStatus(400)
      })
      it('should throw an exception if no body', () => {
        return pactum
        .spec()
        .post('/signup')
        .expectStatus(400)
      })
      it('should signup', () => {
        return pactum
        .spec()
        .post('/signup')
        .withBody(dto)
        .expectStatus(201)
      });
    });

    describe('Signin', () => {
      it('should throw an exception if email empty', () => {
        return pactum
        .spec()
        .post('/signin')
        .withBody({
          password: dto.password,
        })
        .expectStatus(400)
      })
      it('should throw an exception if password empty', () => {
        return pactum
        .spec()
        .post('/signin')
        .withBody({
          email: dto.email,
        })
        .expectStatus(400)
      })
      it('should throw an exception if no body', () => {
        return pactum
        .spec()
        .post('/signin')
        .expectStatus(400)
      })
      it('should signin', () => {
        return pactum
        .spec()
        .post('/signin')
        .withBody(dto)
        .expectStatus(200)
        .stores('userAt', 'access_token')
      });
    });
  });

  describe('User', () => {
    describe('Get me', () => {
      it('should get current user', () => {
        return pactum
        .spec()
        .get('/users/me')
        .withHeaders({
          Authorization: 'Bearer $S{userAt}'
        })
        .expectStatus(200)
      })
    });

    describe('Edit user', () => {
      it('should edit user', () => {
        const dto:EditUserDto = {
          firstName: 'Vladimir',
          email: 'vlad@codewithvlad.com'
        }
        return pactum
        .spec()
        .patch('/users')
        .withHeaders({
          Authorization: 'Bearer $S{userAt}'
        })
        .withBody(dto)
        .expectStatus(200)
        .expectBodyContains(dto.firstName)
        .expectBodyContains(dto.email)
      })
    });
    });
  });

  describe('Bookmark', () => {
    describe('Get empty bookmarks', () => {
      it('should get bookmarks', () => {
        return pactum
          .spec()
          .get('/bookmarks')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200)
          .expectBody([]);
      });
    });

    describe('Create bookmark', () => {})

    describe('Get bookmarks', () => {});

    describe('Get bookmark by id', () => {});

    describe('Edit bookmark by id', () => {});    

    describe('Delete bookmark by id', () => {});
  })
