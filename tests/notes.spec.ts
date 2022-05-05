import request from 'supertest';
import _ from 'lodash';
import appConfig from '../src/app';
import { cleanDB } from './db';
import { TestNotes, TestUser } from './util';

const { app, build } = appConfig;
const serverDomain = '/api';
const auth = `${serverDomain}/auth`;
const notesDomain = `${serverDomain}/notes`;

const TestUserUtil = new TestUser();
const TestNotesUtil = new TestNotes();

const agent = request.agent(app);

jest.setTimeout(2000);

beforeAll(async () => {
  process.env.NODE_ENV = 'test';
  await build();
  await cleanDB();

  // Sign up and login the user
  await agent.post(`${auth}/signUp`).send(TestUserUtil.getSignUpData());
  await agent.post(`${auth}/login`).send(TestUserUtil.getLoginData());
});

afterAll(async () => {
  return cleanDB();
});

describe('Notes', () => {
  const dummyNotes = TestNotesUtil.getNotes();
  it('should be authenticated', async () => {
    const response = await agent.get(`${auth}/secret`);
    return expect(response.statusCode).toBe(200);
  });

  it('should insert multiple notes', async () => {
    for (const note of dummyNotes) {
      const response = await agent.post(`${notesDomain}`).send(note);

      expect(response.body).toHaveProperty('data.title');
      expect(response.body).toHaveProperty('data.content');
      expect(response.statusCode).toBe(200);
    }
    return;
  });

  it('should retrieve all the user notes', async () => {
    const response = await agent.get(`${notesDomain}`);
    const notes = response.body.data;
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(notes)).toBe(true);

    notes.forEach((note: { id: number; title: string }) => {
      expect(note).toHaveProperty('title');
      expect(note).toHaveProperty('content');
    });
    return;
  });
});
