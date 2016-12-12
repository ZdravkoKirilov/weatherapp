const Arrow = require('arrow');

const WeatherRoute = Arrow.Router.extend({
    name: 'weather',
    path: '/weather/:days',
    method: 'GET',
    description: '5 days weatger forecast web route',
    action: function(req, resp, next) {

        const ip_address = req.hostname;
        const days = req.params.days;
        req.server.getAPI('api/weather', 'GET').execute({
            ip_address: ip_address,
            days: days,
        }, function(err, results, next) {
            if (err) {
                resp.render('forecast', results);
            } else {
                resp.render('forecast', results);
            }
        });
    }
});

module.exports = WeatherRoute;
