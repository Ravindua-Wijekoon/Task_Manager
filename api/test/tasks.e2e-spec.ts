import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('Tasks API (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    // Same pipe settings as main.ts
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
    prisma = app.get(PrismaService);
  });

  // Start every test with an empty table
  beforeEach(async () => {
    await prisma.task.deleteMany();
  });

  afterAll(async () => {
    await app.close();
  });

  const createTask = (body: object) =>
    request(app.getHttpServer()).post('/tasks').send(body);

  describe('POST /tasks', () => {
    it('creates a task with defaults', async () => {
      const res = await createTask({ title: 'Buy milk' }).expect(201);

      expect(res.body).toMatchObject({
        title: 'Buy milk',
        status: 'TODO',
        description: null,
        dueDate: null,
      });
      expect(res.body.id).toBeDefined();
      expect(res.body.createdAt).toBeDefined();
    });

    it('trims the title', async () => {
      const res = await createTask({ title: '  Buy milk  ' }).expect(201);
      expect(res.body.title).toBe('Buy milk');
    });

    it('returns 400 when title is missing', async () => {
      await createTask({}).expect(400);
    });

    it('returns 400 when title is only spaces', async () => {
      await createTask({ title: '   ' }).expect(400);
    });

    it('returns 400 for an invalid status', async () => {
      await createTask({ title: 'x', status: 'NOPE' }).expect(400);
    });

    it('returns 400 for an invalid due date', async () => {
      await createTask({ title: 'x', dueDate: 'tomorrow' }).expect(400);
    });

    it('returns 400 for unknown properties', async () => {
      await createTask({ title: 'x', foo: 'bar' }).expect(400);
    });
  });

  describe('GET /tasks', () => {
    it('returns an empty list at first', async () => {
      const res = await request(app.getHttpServer()).get('/tasks').expect(200);
      expect(res.body).toEqual([]);
    });

    it('returns created tasks', async () => {
      await createTask({ title: 'One' });
      await createTask({ title: 'Two' });

      const res = await request(app.getHttpServer()).get('/tasks').expect(200);
      expect(res.body).toHaveLength(2);
    });
  });

  describe('GET /tasks/:id', () => {
    it('returns one task', async () => {
      const { body } = await createTask({ title: 'One' });

      const res = await request(app.getHttpServer())
        .get(`/tasks/${body.id}`)
        .expect(200);
      expect(res.body.title).toBe('One');
    });

    it('returns 404 when the task does not exist', async () => {
      await request(app.getHttpServer()).get('/tasks/99999').expect(404);
    });

    it('returns 400 when the id is not a number', async () => {
      await request(app.getHttpServer()).get('/tasks/abc').expect(400);
    });
  });

  describe('PATCH /tasks/:id', () => {
    it('updates only the sent fields', async () => {
      const { body } = await createTask({ title: 'One', description: 'keep' });

      const res = await request(app.getHttpServer())
        .patch(`/tasks/${body.id}`)
        .send({ status: 'DONE' })
        .expect(200);

      expect(res.body.status).toBe('DONE');
      expect(res.body.title).toBe('One');
      expect(res.body.description).toBe('keep');
    });

    it('clears the due date when null is sent', async () => {
      const { body } = await createTask({
        title: 'One',
        dueDate: '2026-12-31',
      });

      const res = await request(app.getHttpServer())
        .patch(`/tasks/${body.id}`)
        .send({ dueDate: null })
        .expect(200);
      expect(res.body.dueDate).toBeNull();
    });

    it('returns 400 for an empty title', async () => {
      const { body } = await createTask({ title: 'One' });

      await request(app.getHttpServer())
        .patch(`/tasks/${body.id}`)
        .send({ title: '' })
        .expect(400);
    });

    it('returns 404 when the task does not exist', async () => {
      await request(app.getHttpServer())
        .patch('/tasks/99999')
        .send({ status: 'DONE' })
        .expect(404);
    });
  });

  describe('DELETE /tasks/:id', () => {
    it('deletes a task', async () => {
      const { body } = await createTask({ title: 'One' });

      await request(app.getHttpServer())
        .delete(`/tasks/${body.id}`)
        .expect(204);
      await request(app.getHttpServer()).get(`/tasks/${body.id}`).expect(404);
    });

    it('returns 404 when the task does not exist', async () => {
      await request(app.getHttpServer()).delete('/tasks/99999').expect(404);
    });
  });
});
