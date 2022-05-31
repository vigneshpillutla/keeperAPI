import request from 'supertest';
import _ from 'lodash';
import dbConfig from '../src/config/database';
import appConfig from '../src/app';
import { cleanDB } from './db';
import { TestUser } from './util';

const { mongoose } = dbConfig;
const { app, build, cleanUp } = appConfig;
const serverDomain = '/api';
const auth = `${serverDomain}/auth`;
const user = `${serverDomain}/users`;

jest.setTimeout(2000);

beforeAll(async () => {
  process.env.NODE_ENV = 'test';
  await build();
  return cleanDB();
});

afterAll((done) => {
  cleanDB();
  done();
});

describe('Check if the api is running and configured', () => {
  test('Database should be connected', async () => {
    return expect(mongoose.connection.readyState).toBe(1);
  });

  test('API should be running', async () => {
    const response = await request(app).get('/');
    return expect(response.statusCode).toBe(200);
  });
});

describe('User', () => {
  const agent = request.agent(app);
  // const testUser = {
  //   firstName: 'Test',
  //   lastName: 'User',
  //   email: 'testuser@gmail.com',
  //   password: 'TestUser$1234'
  // };
  const TestUserUtil = new TestUser();
  const userData = TestUserUtil.getUserData();
  const loginData = TestUserUtil.getLoginData();
  const signUpData = TestUserUtil.getSignUpData();
  const successResponse = {
    success: true,
    msg: 'User successfully signed up!',
    user: userData
  };

  it('should create a new user', async () => {
    const response = await request(app).post(`${auth}/signUp`).send(signUpData);
    expect(response.statusCode).toBe(201);
    return expect(response.body).toEqual(successResponse);
  });

  it('should not allow a duplicate user', async () => {
    const response = await request(app).post(`${auth}/signUp`).send(signUpData);
    return expect(response.statusCode).toBe(400);
  });

  it('should successfully login', async () => {
    const response = await agent.post(`${auth}/login`).send(loginData);
    expect(response.statusCode).toBe(200);
    expect(response.headers['set-cookie']).toHaveLength(1);
    return expect(response.body).toEqual({
      success: true,
      user: userData
    });
  });

  it('should persist login', async () => {
    const response = await agent.get(`${auth}/secret`);
    return expect(response.statusCode).toBe(200);
  });

  it('should retrieve the data of the logged in user', async () => {
    const response = await agent.get(`${user}`);
    expect(response.statusCode).toBe(200);
    return expect(response.body).toEqual({
      success: true,
      user: userData
    });
  });

  it('should not login with invalid credentials', async () => {
    const response = await request(app)
      .post(`${auth}/login`)
      .send(TestUserUtil.getLoginData('email'));

    return expect(response.statusCode).toBe(401);
  });
});
