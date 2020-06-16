const mongoose = require('mongoose');

const auctionSchema = new mongoose.Schema({

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  }
}, {
  toJSON: {
    virtuals: true
  }
});

auctionSchema.virtual('bid', {
  ref: 'Bid',
  localField: '_id',
  foreignField: 'auction'
});


module.exports = mongoose.model('Auction', auctionSchema);
