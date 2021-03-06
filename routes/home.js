'use strict';

var express = require('express');
var router = express.Router();
var path = require('path');

var userApi = require(path.join(__dirname, '..', 'api', 'users'));
var loginApi = require(path.join(__dirname, '..', 'api', 'login'));

var authenticated = function (req, res, next) {
  if (req.signedCookies.name) {
    next();
  }
};

router.get('/', authenticated, function (req, res) {
  let app = {
    db: req.db
  };
  let data = {
    _id: req.signedCookies.name
  };
  const onFind = function (err, data) {
    if (data.token && data.expire) {
      if (data.name) {
        res.render('home', {user: data})
      }
      else {
        res.redirect('/home/profile');
      }
    }
    else {
      res.render('email');
    }
  };
  userApi.find(app, data, onFind);
});

router.get('/profile', authenticated, function (req, res) {
  //add profile
  res.render('profile');
});

router.post('/profile', authenticated, function (req, res) {
  let data = {
    _id: req.signedCookies.name,
    name: req.body.name,
    position: req.body.position,
    skills: []
  };
  for (i = 1;i <= 3;i++) {
    data.skills.push(req.body.skill_+i);
  }
  let app = {
    db: req.db
  };
  const onUpdate = function (err) {
    if (!err) {
      res.redirect('/home');
    }
  };
  userApi.profile(app, data, onUpdate);
});

router.get('/verify/:token', authenticated, function (req, res) {
  let data = {
    _id: req.signedCookies.name,
    token: req.params.token
  };
  let app = {
    db: req.db
  };
  const onVerify = function (err) {
    if (!err) {
      res.render('verify');
    }
  };
  loginApi.getVerify(app, data, onVerify);
});

router.post('/verify/:token', authenticated, function (req, res) {
  if (req.body.password === req.body.confirm_password) {
    let data = {
      token: req.params.token,
      _id: req.signedCookies.name,
      password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10))
    };
    const onVerify = function (err, data) {
      if (!err) {
        res.redirect('/home/profile');
      }
    };
    loginApi.verify(app, data, onVerify);
  }
});

module.exports = router;
