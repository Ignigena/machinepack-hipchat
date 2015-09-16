module.exports = {
  friendlyName: 'View user',
  description: 'Get a user\'s details.',
  cacheable: false,
  sync: false,
  inputs: {
    token: {
      example: '8afbe6dea02407989af4dd4c97bb6e25',
      description: 'Authentication token with `view_group` scope.',
      required: true,
      whereToGet: {
        url: 'https://www.hipchat.com/docs/apiv2/auth'
      }
    },
    userId: {
      example: 'albert@praxent.com',
      description: 'The id, email address, or mention name (beginning with an \'@\') of the user to view.',
      required: true
    }
  },
  exits: {
    success: {
      variableName: 'result',
      description: 'Done.',
    },
    error: {
      description: 'An unexpected error occurred.',
    },
    notAuthorized: {
      description: 'The request could not be authorized.'
    },
    notFound: {
      description: 'The user could not be found.'
    }
  },


  fn: function(inputs, exits) {
    var hipchat = require('../hipchat.js'),
        HipChat = new hipchat(inputs.token);

    HipChat.query('user/' + inputs.userId, 'get', function(err, response) {
      if (err) return exits.error(err);

      var result = JSON.parse(response.body);

      if (result.error) {
        return HipChat.handleError(result, exits);
      }

      return exits.success(result);
    });
  },

};
