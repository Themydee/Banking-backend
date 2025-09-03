const request = require('supertest');
const app = require('../app'); // your Express app
const { sequelize, Account, Customer } = require('../models');

beforeAll(async () => {
  // Sync database for testing
  await sequelize.sync({ force: true });

  // Create a test customer
  await Customer.create({ id: 1, name: 'John Doe', email: 'john@example.com', isVerified: true });
});

afterAll(async () => {
  await sequelize.close();
});

describe('Account API', () => {
  it('should create a new account', async () => {
    const res = await request(app)
      .post('/api/account/create')
      .send({ customerId: 1, type: 'savings' });

    expect(res.statusCode).toBe(201);
    expect(res.body.account).toHaveProperty('account_number');
    expect(res.body.account.type).toBe('savings');
  });

  it('should get account details', async () => {
    const account = await Account.findOne({ where: { customerId: 1 } });
    const res = await request(app).get(`/api/account/${account.account_number}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.account.account_number).toBe(account.account_number);
  });
});
