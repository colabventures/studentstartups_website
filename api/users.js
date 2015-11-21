'use strict';

var path = require('path');

var mongoUsers = require(path.join(__dirname, '..', 'db', 'mongo-users'));

exports.find = function (app, data, callback) {
  const onFetch = function (err, doc) {
    if (!err) {
      callback(null, doc);
    }
  };
  mongoUsers.find(app, data, onFetch);
};
