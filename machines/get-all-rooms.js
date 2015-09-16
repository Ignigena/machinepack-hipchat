module.exports = {
  friendlyName: 'Get all rooms',
  description: 'List all rooms for this group.',
  cacheable: false,
  sync: false,
  inputs: {
    token: {
      example: '8afbe6dea02407989af4dd4c97bb6e25',
      description: 'Authentication token with `view_group` or `view_room` scope.',
      required: true,
      whereToGet: {
        url: 'https://www.hipchat.com/docs/apiv2/auth'
      }
    },
    startIndex: {
      example: 100,
      description: 'The maximum number of results.',
      required: false
    },
    maxResults: {
      example: 0,
      description: 'The start index for the result set.',
      required: false
    },
    includePrivate: {
      example: true,
      description: 'Include private rooms in the results.',
      required: false
    },
    includeArchived: {
      example: false,
      description: 'Include archived rooms in the results.',
      required: false
    }
  },
  exits: {
    success: {
      variableName: 'result',
      description: 'Done.',
      example: {
        items: [
          {
            id: 61700,
            links: {
              participants: 'https://api.hipchat.com/v2/room/61700/participant',
              self: 'https://api.hipchat.com/v2/room/61700',
              webhooks: 'https://api.hipchat.com/v2/room/61700/webhook',
            },
            name: 'Water Cooler',
            version: 'HVWFXZNU'
          }
        ],
        links: { self: 'https://api.hipchat.com/v2/room' },
        maxResults: 100,
        startIndex: 0
      }
    },
    error: {
      description: 'An unexpected error occurred.',
    },
    notAuthorized: {
      description: 'The request could not be authorized.'
    },
  },


  fn: function(inputs, exits) {
    var hipchat = require('../hipchat.js'),
        HipChat = new hipchat(inputs.token);

    HipChat.query('room', 'get', inputs, function(err, response) {
      if (err) return exits.error(err);

      var result = JSON.parse(response.body);

      if (result.error) {
        return HipChat.handleError(result, exits);
      }

      return exits.success(result);
    });
  },

};
