'use strict';

var Promise = global.Promise || require('bluebird');
var request = require('superagent');

var BDCRequest = function(credentials) {
  this.Credentials = credentials;
};

BDCRequest.prototype.post = function(url, params, cb) {
  request.post(url)
    .send(params)
    .set('Content-Type', 'application/x-www-form-urlencoded')
    .set('Accept', 'application/json')
    .end(function(err, res) {
      if (err) { return cb(err); }
      else if (res.body.response_status === 1) { return cb(res.body.response_data); }
      else { return cb(null, res.body.response_data); }
    });
};

BDCRequest.prototype.promise = function(url, params) {
  var self = this;
  return new Promise(function(resolve, reject) {
    self.post(url, params, function(err, res) {
      if (err) { return reject(err); }
      return resolve(res);
    });
  });
};

BDCRequest.prototype.request = function(url, params, cb) {
  if (cb && typeof cb === 'function') {
    this.post(url, params, cb);
  } else {
    return this.promise(url, params);
  }
};

module.exports = BDCRequest;
