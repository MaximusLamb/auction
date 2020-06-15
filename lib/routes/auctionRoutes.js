const { Router } = require('express');
const Auction = require('../models/Auction');
const { ensureAuth } = require('../middleware/ensureAuth');

module.exports = Router()
  .post('/', ensureAuth,  (req, res, next) => {
    Auction
      .create({
        user: req.user._id,
        title: req.body.title,
        description: req.body.description,
        quantity: req.body.quantity,
        endDate: Date.now(),
      })
      .then(auction => res.send(auction))
      .catch(next);
  })
  .get('/:id', ensureAuth, (req, res, next) => {
    Auction
      .findById(req.params.id)
      .populate('users')
      .populate('bids')
      .then(auction => res.send(auction))
      .catch(next);
  })
