'use strict';

var BDCRequest = require('lib/BDCRequest');

var LOGIN_URL = 'https://api.bill.com/api/v2/';

var BillDotCom = function(credentials) {
  if (!credentials) {
    throw new Error('Must provide credentials.');
  }
  if (!credentials.userName) {
    throw new Error('Must specify \'userName\'.');
  }
  if (!credentials.password) {
    throw new Error('Must specify \'password\'.');
  }
  if (!credentials.orgId) {
    throw new Error('Must specify \'orgId\'.');
  }
  if (!credentials.devKey) {
    throw new Error('Must specify \'devKey\'.');
  }
  this.request = new BDCRequest(credentials);
};

module.exports = BillDotCom;
