const request = require('supertest');
const { app, server } = require('./app');

describe('Basic Route Tests', () => {
  test('GET / should return 200', async () => {
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(200);
  });

  test('GET /debug should return JSON', async () => {
    const response = await request(app).get('/debug');
    expect(response.statusCode).toBe(200);
    expect(response.type).toBe('application/json');
  });

  test('POST /login with correct credentials should succeed', async () => {
    const response = await request(app)
      .post('/login')
      .send({ username: 'admin', password: 'secretpassword' });
    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
  });

  afterAll(done => {
    server.close(done);
  });
});