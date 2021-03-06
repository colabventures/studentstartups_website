'use strict';

var email = require('emailjs');

let serverOptions = {
  user: 'agarwalayush161@gmail.com',
  password: process.env.PASSWORD,
  host: 'smtp.gmail.com',
  ssl: true
};

var server = email.server.connect(serverOptions);

exports.register = function (data, callback) {
  let message = {
    from: 'agarwalayush161@gmail.com',
    to: data._id,
    subject: 'Verification of Email At Student Startups',
    text: 'Hey!\nYou have signed up at StudentStartups using this Email ID. Please click at the following link to verify your account: http://www.studentstartups.io/home/verify/' + data.token + 'The link is to be used only once.\n\nThanks,\nTeam StudentStartups,\nColab Ventures'
  };
  server.send(message, callback);
};

exports.reset = function (data, callback) {
  let message = {
    from: 'agarwalayush161@gmail.com ',
    to: data._id,
    subject: 'StudentStartups Password Reset Link',
    text: 'A password reset request was made from your account. Please click at the following link to reset your password: http://www.studentstartups.io/reset/' + data.token + 'The link can only be used once.\n\nThanks,\nTeam StudentStartups,\nColab Ventures'
  };
  server.send(message, callback);
};
