'use strict';

const Boom = require('boom');
const User = require('../model/User');

function verifyUniqueUser(req, res) {
  User.findOne({
    $or: [
      { email: req.payload.email },
      { username: req.payload.username }
    ]
  }, (err, user) => {

    if (user) {
      if (user.username === req.payload.username) {
        res(Boom.badRequest('Username taken'));
      }
      if (user.email === req.payload.email) {
        res(Boom.badRequest('Email taken'));
      }
    }

    res(req.payload);
  });
}

module.exports = {
  verifyUniqueUser: verifyUniqueUser
}