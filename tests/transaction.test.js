const request = require('supertest');
const app = require('../app');
const { Account } = require('../models');

describe('Transaction API', () => {
  let account;

  beforeAll(async () => {
    account = await Account.create({ customerId: 1, type: 'savings', balance: 5000 });
  });

  it('should deposit funds', async () => {
    const res = await request(app)
      .post('/api/transactions/deposit')
      .send({ accountId: account.id, amount: 1000 });

    expect(res.statusCode).toBe(200);
    expect(res.body.balance).toBe('6000'); // 5000 + 1000
  });

  it('should withdraw funds', async () => {
    const res = await request(app)
      .post('/api/transactions/withdraw')
      .send({ accountId: account.id, amount: 2000 });

    expect(res.statusCode).toBe(200);
    expect(res.body.balance).toBe('4000'); // 6000 - 2000
  });
});
