const mongoose = require('mongoose');
const bcrypt = require('bvryptjs');

const userSchema = new mongoose.Schema({

  email: {
    type: String,
    require: true
  },
  passwordHash: {
    type: String,
    required: true
  }
}, {
  toJSON: {
    virtuals: true
  }
});

mongoose.Schema.virtual('password').set(function(password) {
  this.passwordHash = bcrypt.hashSync(password, )
})