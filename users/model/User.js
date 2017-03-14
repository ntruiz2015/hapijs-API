'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const autoIncrement = require('mongoose-auto-increment');
const db = require('../config/db').db;

autoIncrement.initialize(db);

const userModel = new Schema({
    email: { type: String, required: true, index: { unique: true } },
    username: { type: String, required: true, index: { unique: true } },
    password: { type: String, required: true },
    admin: { type: Boolean, required: true },
    isVerified: {type: Boolean, default: false}
});

module.exports = mongoose.model('User', userModel);



User.plugin(autoIncrement.plugin, {
    model: 'user',
    field: '_id'
});

User.statics.saveUser = function (requestData, callback) {
    this.create(requestData, callback);
};

User.statics.updateUser = function (user, callback) {
    user.save(callback);
};

User.statics.findUser = function (userName, callback) {
    this.findOne({
        userName: userName
    }, callback);
};

User.statics.findUserByIdAndUserName = function (id, userName, callback) {
    this.findOne({
        userName: userName,
        _id: id
    }, callback);
};

var user = mongoose.model('user', User);