const { MongoMemoryServer } = require('mongodb-memory-server');
const mongod = new MongoMemoryServer();
const mongoose = require('mongoose');
const connect = require('../lib/utils/connect');

// const Auction = require('../lib/models/Auction');
// const Bid = require('../lib/models/Bid');

const request = require('supertest');
const app = require('../lib/app');

describe('auction routes', () => {
  beforeAll(async() => {
    const uri = await mongod.getUri();
    return connect(uri);
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  afterAll(async() => {
    await mongoose.connection.close();
    return mongod.stop();
  });

  it('creates an auction', () => {
    return request(app)
      .post('/api/v1/Auction')
      .send({
        user: 'steve@castiel.com',
        title: 'Cheap Sneakers',
        description: 'Crappy Shoes',
        quantity: 2,
        endDate: Date.now()
      })
      .then(res => {
        expect(res.body).toEqual({
          user: 'steve@castiel.com',
          title: 'Cheap Sneakers',
          description: 'Crappy Shoes',
          quantity: 2,
          endDate: expect.anything(),
          __v: 0
        });
      });
  });
});
