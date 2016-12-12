'use strict';

const Arrow = require('arrow');
const weatherman = require('../web/helpers/weatherman');

const WeatherAPI = Arrow.API.extend({
    group: 'weatherapi',
    path: '/api/weather',
    method: 'GET',
    description: 'this is an api that shows x day weather forecast',
    parameters: {
        days: {
            description: 'How many days will be shown',
            optional: true,
        },
        ip_address: {
            description: 'The IP Address of the user',
            optional: true,
        }
    },
    action: function(request, response, next) {

        weatherman.get_5DayForecast({
            ip: request.params.ip_address,
            days: request.params.days,
        }, function(err, data) {
            if (err) {
                response.json({
                    error: 'An error occured.',
                }, next);
            } else {
                response.json(data, next);
            }
        });
    }
});

module.exports = WeatherAPI;
