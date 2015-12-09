'use strict';

var path = require('path');
var crypto = require('crypto');

var mongoUsers = require(path.join(__dirname, '..', 'db', 'mongo-users'));

exports.find = function (app, data, callback) {
  const onFetch = function (err, doc) {
    if (!err) {
      callback(null, doc);
    }
  };
  mongoUsers.find(app, data, onFetch);
};

exports.profile = function (app, data, callback) {
  const onUpdate = function (err) {
    if (!err) {
      callback(null);
    }
  };
  mongoUsers.updateProfile(app, data, onUpdate);
};
