const { MongoMemoryServer } = require('mongodb-memory-server');
const mongod = new MongoMemoryServer();
const mongoose = require('mongoose');
const connect = require('../lib/utils/connect');

const User = require('../lib/models/User');
const Auction = require('../lib/models/Auction');
const Bid = require('../lib/models/Bid');

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

  it('creates an auction', () => {
    return request(app)
      .post('/api/v1/Auctions')
      .auth('steve@castiel.com', 'salmondean')
      .send({
        title: 'Cheap Sneakers',
        description: 'Crappy Shoes',
        quantity: 2,
        endDate: Date.now()
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.anything(),
          id: expect.anything(),
          user: user.id,
          title: 'Cheap Sneakers',
          description: 'Crappy Shoes',
          quantity: 2,
          endDate: expect.anything(),
          __v: 0
        });
      });
  });

  it('gets an auction by id', async() => {

    const auction = await Auction.create({
      user: user.id,
      title: 'Cheap Sneakers',
      description: 'Crappy Shoes',
      quantity: 2,
      endDate: Date.now()
    });
    return request(app)
      .get(`/api/v1/Auctions/${auction._id}`)
      .auth('steve@castiel.com', 'salmondean')
      .then(res => {
        expect(res.body).toEqual({
          user: {
            _id: expect.anything(),
            email: 'steve@castiel.com'
          },
          _id: expect.anything(),
          id: expect.anything(),
          title: 'Cheap Sneakers',
          description: 'Crappy Shoes',
          quantity: 2,
          endDate: expect.anything(),
          __v: 0
        });
      }); 
  });

  it('gets a list of auctions', async() => {
    return request(app)
      .get('/api/v1/Auctions')
      .auth('steve@castiel.com', 'salmondean')
      .then(res => {
        expect(res.body).toEqual([{
          user: user.id,
          _id: expect.anything(),
          id: expect.anything(),
          title: 'Cheap Sneakers',
          description: 'Crappy Shoes',
          quantity: 2,
          endDate: expect.anything(),
          __v: 0
        }]);
      }); 
  });
});
