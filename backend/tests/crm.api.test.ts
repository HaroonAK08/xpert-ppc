import { beforeAll, afterAll, describe, expect, it } from 'vitest';
import mongoose from 'mongoose';
import request from 'supertest';

import { createApp } from '../src/app';
import { AdminUser } from '../src/models/AdminUser';
import { Lead } from '../src/models/Lead';
import { hashPassword } from '../src/utils/password';

const MONGO =
  process.env.MONGODB_URI_TEST || 'mongodb://127.0.0.1:27017/xpertppc_crm_test';

describe('CRM API', () => {
  const app = createApp();
  let token = '';
  let leadId = '';

  beforeAll(async () => {
    process.env.JWT_SECRET =
      process.env.JWT_SECRET || 'test-secret-key-at-least-32-characters-long!!';
    await mongoose.connect(MONGO);
    await Promise.all([
      AdminUser.deleteMany({}),
      Lead.deleteMany({}),
    ]);

    await AdminUser.create({
      email: 'crm-admin@xpertppc.test',
      name: 'CRM Admin',
      passwordHash: await hashPassword('TestPass123!'),
      role: 'admin',
      active: true,
    });

    const login = await request(app)
      .post('/api/auth/login')
      .send({ email: 'crm-admin@xpertppc.test', password: 'TestPass123!' });
    expect(login.status).toBe(200);
    token = login.body.token;
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  it('creates and lists leads', async () => {
    const create = await request(app)
      .post('/api/v1/leads')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Test Lead',
        email: 'test.lead@xpertppc.test',
        phone: '03001234567',
        businessName: 'Test Co',
        message: 'Hello',
      });
    expect(create.status).toBe(201);
    expect(create.body.data.phoneNormalized).toBe('+923001234567');
    leadId = create.body.data.id;

    const list = await request(app)
      .get('/api/v1/leads?search=Test')
      .set('Authorization', `Bearer ${token}`);
    expect(list.status).toBe(200);
    expect(list.body.data.length).toBeGreaterThan(0);
    expect(list.body.meta.page).toBe(1);
  });

  it('marks contacted and replied', async () => {
    const contacted = await request(app)
      .post(`/api/v1/leads/${leadId}/contact`)
      .set('Authorization', `Bearer ${token}`)
      .send({ note: 'Called, no answer' });
    expect(contacted.status).toBe(200);
    expect(contacted.body.data.status).toBe('contacted');
    expect(contacted.body.data.contactedAt).toBeTruthy();

    const replied = await request(app)
      .post(`/api/v1/leads/${leadId}/reply`)
      .set('Authorization', `Bearer ${token}`)
      .send({ note: 'WhatsApp reply received', channel: 'whatsapp' });
    expect(replied.status).toBe(200);
    expect(replied.body.data.replied).toBe(true);
    expect(replied.body.data.status).toBe('replied');
  });

  it('adds notes and follow-up', async () => {
    const note = await request(app)
      .post(`/api/v1/leads/${leadId}/notes`)
      .set('Authorization', `Bearer ${token}`)
      .send({ text: 'Interested in SEO package' });
    expect(note.status).toBe(201);

    const when = new Date(Date.now() + 86400000).toISOString();
    const follow = await request(app)
      .post(`/api/v1/leads/${leadId}/follow-up`)
      .set('Authorization', `Bearer ${token}`)
      .send({ followUpAt: when });
    expect(follow.status).toBe(200);
    expect(follow.body.data.status).toBe('follow_up');
  });

  it('returns dashboard stats', async () => {
    const res = await request(app)
      .get('/api/v1/dashboard')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.data.stats.total).toBeGreaterThan(0);
  });

  it('rejects unauthenticated access', async () => {
    const res = await request(app).get('/api/v1/leads');
    expect(res.status).toBe(401);
  });
});
