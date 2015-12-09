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
      callback(true, null);
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
  collection.findOneAndUpdate({_id: data._id, token: data.token}, operation, onUpdate);
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

exports.updateProfile = function (app, data, callback) {
  let collection = app.db.collection('users');
  const onUpdate = function (err) {
    if (!err) {
      callback(null);
    }
    else {
      callback(err);
    }
  };
  collection.findAndModify({_id: data._id}, {
    $set: {
      name: data.name,
      position: data.position,
      skills: data.skills
    }
  }, onUpdate);
};

exports.reset = function (app, data, callback) {
  let collection = app.db.collection('users');
  const onUpdate = function (err) {
    if (!err) {
      callback(null);
    }
  };
  let operation = {
    $set: {
      token: data.token
    }
  };
  collection.findOneAndUpdate({_id: data._id}, operation, onUpdate);
};

exports.passwordReset = function (app, data, callback) {
  let collection = app.db.collection('users');
  const onUppdate = function (err) {
    if (!err) {
      callback(null);
    }
  };
  collection.findOneAndUpdate({_id: data._id, token: data.token}, {
    $set: {
      password: data.password
    },
    $unset: {
      token: null
    }
  }, onUppdate);
};
