var request = require('request');
var qs = require('querystring');

var HipChat = function(token, endpoint) {
  this.token = token;
  this.endpoint = endpoint || 'https://api.hipchat.com/v2/';
}

HipChat.prototype = {

  auth: function(email, token) {
    this.email = email;
    this.token = token;
    return this;
  },

  query: function(where, method, params, next) {
    if (typeof params === 'function') {
      next = params;
      params = {};
    }

    var options = {
      url: this.endpoint + where,
      headers: {
        'Authorization': 'Bearer ' + this.token
      }
    };

    this.hyphenateParams(params);

    if (Object.getOwnPropertyNames(params).length > 0 && method !== 'get') {
      options.json = true;
      options.body = params;
    }

    if (Object.getOwnPropertyNames(params).length > 0 && method === 'get') {
      options.url = [options.url, qs.stringify(params)].join('?');
    }

    request[method](options, next);
  },

  hyphenateParams: function(params) {
    delete params.token;

    for (var param in params) {
      var standardized = param.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
      params[standardized] = params[param];
      delete params[param];
    }

    return params;
  },

  handleError: function(response, exits) {

    switch (response.error.code) {

      case 401:
        return exits.notAuthorized(response.error.message);

      case 404:
        return exits.notFound(result.error.message);

      default:
        return exits.error(response.error);

    }

  }

};

module.exports = HipChat;
