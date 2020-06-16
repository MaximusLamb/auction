const Auction = require('../models/Auction');
const Bid = require('../models/Bid');

const stopAuction = async(auction) => {
  const bids = await Bid
    .find({ auction: auction })
    .sort({ price : 'descending' });

  let sell = auction.quantity;
  
  return Promise.all(bids.map(bid => {
    if(bid.quantity < sell) {
      sell -= bid.quantity;
      return Bid.findOneAndUpdate({ accepted: true }, bid, { new: true, upsert: true });
    }
  }));
};

const checkAuctionBids = async() => {
  const currentTime = new Date();
  const cutOff = currentTime.setHours(currentTime.getHours() - 1);
  cutOff.setHours(cutOff.getHours() - 1);

  const auctions = await Auction.find({ $gte : { endDate: cutOff }, $lte: { endDate: currentTime } 
  });

  return Promise.all(auctions.map(auction => stopAuction(auction)));
};

module.exports = {
  checkAuctionBids
};
