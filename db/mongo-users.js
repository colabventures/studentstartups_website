'use strict';

var path = require('path');
var crypto = require('crypto');

exports.login = function (app, data, callback) {
  let collection = app.db.collection('users');
  const onFetch = function (err, doc) {
    if (err) {
      callback(true, data);
    }
    else if (doc) {
      callback(null, data);
    }
    else {
      const onInsert = function (err) {
        if (!err) {
          callback(null, data);
        }
      };
    }
  };
  collection.findOne(data, onFetch);
};

exports.verify = function (app, data, callback) {
  let collection = app.db.collection('users');
  let operation = {
    $set: {
      password: data.password
    },
    $unset: {
      token: null,
      expire: null
    }
  };
  const onUpdate = function (err, doc) {
    if (err) {
      callback(true, data);
    }
    else if (doc) {
      callback(null, doc);
    }
  };
  collection.findOneAndUpdate(data, operation, onUpdate);
};

exports.find = function (app, data, callback) {
  let collection = app.db.collection('users');
  const onFetch = function (err, doc) {
    if (!err) {
      callback(null, doc);
    }
  };
  collection.findOne(data, onFetch);
};

exports.insert = function (app, data, callback) {
  let collection = app.db.collection('users');
  const onInsert = function (err) {
    if (!err) {
      callback(null, data);
    }
    else {
      callback('User already exists', data);
    }
  };
  collection.insertOne(data, onInsert);
};
