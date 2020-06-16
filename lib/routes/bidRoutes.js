const { Router } = require('express');
const Bid = require('../models/Bid');
// const Auction = require('../models/Auction');

module.exports = Router()
  .post('/', async(req, res, next) => {

    // const now = new Date();
    // const ended = await Auction.findById(req.body.auction);

    // if(ended.endDate > now) {
    Bid
      .findOneAndUpdate({ auction: req.body.auction, user: req.body.user }, req.body, { new: true, upsert: true })
      .then(bid => res.send(bid))
      .catch(next);
    // } else {
    //   const error = new Error('Auction Ended');
    //   next(error);
  })

  .get('/:id', (req, res, next) => {
    Bid
      .findById(req.params.id)
      .then(bid => res.send(bid))
      .catch(next);
  })

  .delete('/:id', (req, res, next) => {
    Bid
      .findById(req.params.id)
      .then(bid => res.send(bid))
      .catch(next);
  });
