'use strict';

var path = require('path');
var bcrypt = require('bcrypt');

var mongoUsers = require(path.join(__dirname, '..', 'db', 'mongo-users'));
var email = require(path.join(__dirname, '..', 'worker', 'email'));

exports.login = function (app, data, callback) {
  const onLogin = function (err, doc) {
    if (bcrypt.compareSync(data.password, doc.password)) {
      callback(null, doc);
    }
    else {
      callback('Passwords do not match', data);
    }
  };
  mongoUsers.login(app, data, onLogin);
};

exports.signUp = function (app, data, callback) {
  const onGenerateHash = function (err, buf) {
    data.token = buf.toString('hex');
    data.expire = Date.now() + 86400000;
    const onInsert = function (err) {
      if (!err) {
        const onSend = function (err) {
          if (!err) {
            callback(null, data);
          }
          else {
            callback('Email Sending Error', data);
          }
        };
        email.register(data, onSend);
      }
    };
    mongoUsers.insert(app, data, onInsert);
  };
  crypto.randomBytes(20, onGenerateHash);
};

exports.getVerify = function (app, data, callback) {
  const onVerify = function (err, doc) {
    if (!err && doc) {
      callback(null, data);
    }
    else {
      callback('User not found or Already verified', data);
    }
  };
  mongoUsers.find(app, data, onVerify);
};

exports.verify = function (app, data, callback) {
  const onVerify = function (err, doc) {
    if (!err) {
      callback(null, doc);
    }
  };
  mongoUsers.verify(app, data, onVerify);
};
