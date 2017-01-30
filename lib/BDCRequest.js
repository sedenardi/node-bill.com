'use strict';

var Promise = global.Promise || require('bluebird');
var request = require('superagent');
var baseUrl = "https://api.bill.com/api/v2/";

var BDCRequest = function(credentials) {
  this.Credentials = credentials;
  this.Credentials.sessionId = null;
  this.apiEndpoint = baseUrl;
};

BDCRequest.prototype.post = function(url, params, cb) {
  var postParams = this.Credentials;

  if(Object.keys(params).length !== 0){
    postParams.data = JSON.stringify(params);
  }

  request.post(url)
    .send(postParams)
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

BDCRequest.prototype.request = function(command, params, cb) {
  var self = this;
  if(this.Credentials.sessionId == null && command != "Login"){
    this.request("Login",{},function(err,loginReturn){
      self.apiEndpoint = loginReturn.apiEndPoint;
      self.Credentials.sessionId = loginReturn.sessionId;
      self.request(command,params,cb);
    });
  }else{
    var url = baseUrl + command + ".json";
    console.log("REQUESTING BC URL: " + url);
    if (cb && typeof cb === 'function') {
      this.post(url, params, cb);
    } else {
      return this.promise(url, params);
    }
  }
};

module.exports = BDCRequest;
