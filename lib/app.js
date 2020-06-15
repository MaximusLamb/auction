const express = require('express');
const app = express();

app.use(express.json());

// app.use('/api/v1/authorize', require('./routes/authorizeRoute'));
app.use('/api/v1/auctions', require('./routes/auctionRoutes'));
app.use('/api/v1/auth', require('./routes/authRoutes'));
app.use('/api/v1/bid', require('./routes/bidRoutes'));

app.use(require('./middleware/not-found'));
app.use(require('./middleware/error'));

module.exports = app;
