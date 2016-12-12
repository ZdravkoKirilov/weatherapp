require('dotenv').config();
const DarkSky = require('dark-sky');
const forecast = new DarkSky(process.env.DARK_SKY_API_KEY);
const satelize = require('satelize');
const moment = require('moment');

const blueprint = {
    get_5DayForecast: function(options, callback) {
        satelize.satelize({
            ip: options.ip,
        }, function(err, payload) {
            if (err) {
                callback(err, null);
            } else {
                payload = payload || {};
                let latitude = payload.latitude || process.env.DEFAULT_LATITUDE;
                let longitude = payload.longitude || process.env.DEFAULT_LONGITUDE;
                let days = parseInt(options.days) || 5;

                forecast
                    .latitude(latitude)
                    .longitude(longitude)
                    .units('ca')
                    .language('en')
                    .exclude('minutely,hourly,currently,alerts,flags')
                    .get()
                    .then(res => {
                        res = res || {};
                        res.daily = res.daily || {};
                        res.daily.data = res.daily.data || [];
                        let lowestTemperature = null;
                        let highestTemperature = null;

                        let formatted = res.daily.data.slice(0, days).map(function(elem) {

                            if (lowestTemperature === null) {
                                lowestTemperature = elem.temperatureMin;
                            } else {
                                lowestTemperature = elem.temperatureMin < lowestTemperature ? elem.temperatureMin : lowestTemperature;
                            }

                            if (highestTemperature === null) {
                                highestTemperature = elem.temperatureMax;
                            } else {
                                highestTemperature = elem.temperatureMax > highestTemperature ? elem.temperatureMax : highestTemperature;
                            }

                            return {
                                summary: elem.summary,
                                date: moment.unix(elem.time).format('DD-MM-YYYY'),
                                temperatureMax: elem.temperatureMax,
                                temperatureMin: elem.temperatureMin,
                                icon: elem.icon,
                            }
                        });

                        callback(null, {
                            timezone: res.timezone,
                            lowestTemperature: lowestTemperature,
                            highestTemperature: highestTemperature,
                            days: formatted,
                        });
                    })
                    .catch(err => {
                        callback(err, null);
                    })
            }
        });
    },
}

module.exports = blueprint;
