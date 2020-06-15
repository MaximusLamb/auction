const { MongoMemoryServer } = require('mongodb-memory-server');
const mongod = new MongoMemoryServer();
const mongoose = require('mongoose');
const connect = require('../lib/utils/connect');

const User = require('../lib/models/User');
const Auction = require('../lib/models/Auction');
const Bid = require('../lib/models/Bid');

const request = require('supertest');
const app = require('../lib/app');

describe('bid routes', () => {
  beforeAll(async() => {
    const uri = await mongod.getUri();
    return connect(uri);
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  let user;
  let bid;
  let auction;

  beforeEach(async() => {
    user = await User.create({
      email: 'steve@castiel.com',
      password: 'salmondean'
    });
    
    auction = await Auction.create({
      user: user.id,
      title: 'Cheap Sneakers',
      description: 'Crappy Shoes',
      quantity: 2,
      endDate: Date.now()
    });
    bid = await Bid.create({
      user: user.id,
      auction: auction.id,
      price: 205,
      quantity: 1,
      accepted: true
    });

  });

  afterAll(async() => {
    await mongoose.connection.close();
    return mongod.stop();
  });

  it('creates a new bid', async() => {
    
    return request(app)
      .post('/api/v1/bid')
      .send({
        auction: auction._id,
        user: user._id,
        price: 5,
        quantity: 1,
        accepted: true
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.anything(),
          id: expect.anything(),
          user: user.id,
          auction: auction.id,
          quantity: 1,
          accepted: true,
          price: 5,
          __v: 0
        });
      });
  });

  it('gets a bid by id', () => {

    return request(app)
      .get(`/api/v1/bid/${bid._id}`)
      .auth('steve@castiel.com', 'salmondean')
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.anything(),
          id: expect.anything(),
          user: user.id,
          auction: auction.id,
          quantity: 1,
          accepted: true,
          price: 205,
          __v: 0
        });
      }); 
  });

  it('deletes a bid', () => {
    request(app)
      .delete(`/api/v1/bid/${bid._id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.anything(),
          user: user.id,
          auction: auction.id,
          price: 205,
          quantity: 1,
          accepted: true
        });
      });
  });
});
