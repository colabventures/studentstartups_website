'use strict';
var path = require('path');
var express = require('express');
var bcrypt = require('bcrypt');
var router = express.Router();

var loginApi = require(path.join(__dirname, '..', 'api', 'login'));

router.get('/', function (req, res) {
  res.render('index');
});

router.get('/contact', function (req, res) {
  res.render('contact');
});

router.get('/signup', function (req, res) {
  res.render('signup');
});

router.post('/signup', function (req, res) {
  let app = {
    db: req.db
  };
  let data = {
    _id: req.body.email
  };

  const onSignUp = function (err, doc) {
    if (!err) {
      res.cookie('name', doc._id, {signed: true, maxAge: 86400000000});
      res.redirect('/home');
    }
  };
  loginApi.signUp(app, data, onSignUp);
});

router.get('/login', function (req, res) {
  res.render('login');
});

router.post('/login', function (req, res) {
  let data = {
    _id: req.body.email,
    password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10))
  };
  let app = {
    db: req.db
  };
  let onLogin = function (err, data) {
    res.cookie('name', data._id, {signed: true, maxAge: 86400000000});
    res.redirect('/home');
  };
  loginApi.login(app, data, onLogin);
});

router.get('/logout', function (req, res) {
  if (req.signedCookies.name) {
    res.clearCookie('name', {});
    res.redirect('/');
  }
  else {
    //no logged in session functionality
  }
});
module.exports = router;
