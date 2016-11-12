BR.Rates = new Service({

    Name: 'Rates',

    Model: {

        Hash: {
            type: String,
            default: ''
        },
        Title: {
            type: String,
            default: ''
        },
        Image: {
            type: String,
            default: ''
        },
        Cost: {
            type: String,
            default: ''
        },
        Rate: {
            type: Number,
            default: 0
        },
        Date: {
            type: Date,
            default: Date.now
        }

    },

    Events: {

        'Database Ready': function() {

            this.Collection = BR.Mongo.collection('rates');

            BR.Cache.create(this.Name, function(ready) {

                BR.Rates.updateTopRatesCache(function() {

                    ready();

                });

            });

        },

        'User Connected': function(connection_data) {

            BR.SendToConnection(connection_data, {
                Rates: this.TopRates
            });

        },

        'Top Rates Cache Updated': function() {

            BR.SendToAllConnections({
                Rates: this.TopRates
            });

        }

    },

    Routes: {

        '/Rates/add': function(req, res, next) {

            next({});

            this.processNewRates(req.body.Source, req.body.Rates);

        }

    },

    Actions: {

        getRates: function(connection_data, data) {

            this.getRates(data.Filter, function(rates) {

                BR.SendToConnection(connection_data, {
                    Rates: rates
                });

            });

        }

    },

    initialize: function () {

        this.TopRates = [];

    },

    processNewRates: function(source, rates) {

        //Собираем массив уникальных хэшей для этих отзывов
        var hashes = [];

        _.each(rates, function(rate_data) {

            //Строка для хэширования
            var key_string = rate_data.title + '-' + rate_data.image;

            //Создаём уникальный хэш дляэтого отзыва
            var sha = BR.Crypto.createHash('sha256');

            sha.update(key_string);

            var hash = sha.digest('hex');

            hashes.push(hash);

            rate_data.hash = hash;

        }, this);

        //Ищем отзывы по этим хэшам в базе
        BR.Rates.Collection.find({Hash: {$in: hashes}}, {Hash: true}, {}).toArray(function(err, exist_hashes) {

            exist_hashes = _.pluck(exist_hashes, 'Hash');

            BR.Logger.debug('Ищем в базе отзыв с хэшем ', hashes, exist_hashes);

            _.each(rates, function(rate_data) {

                //Если отзыва с таким хэшем нет в базе
                if (!_.contains(exist_hashes, rate_data.hash)) {

                    //Сохраняем в БД
                    BR.Rates.Collection.insert({
                        Hash: rate_data.hash,
                        Title: rate_data.title,
                        Image: rate_data.image,
                        Cost: rate_data.cost,
                        Rate: rate_data.rate,
                        Date: rate_data.date
                    }, function(err, rate) {

                        BR.Logger.debug('Добавлен новый отзыв', rate);

                    });

                }

            });

        });

    },

    updateTopRatesCache: function(next) {

        BR.Rates.getTopRates(function(rates) {

            BR.Rates.TopRates = rates;

            Broadcast.call('Top Rates Cache Updated');

            if (next) next();

        });

    },

    getTopRates: function(next) {

        BR.Rates.Collection.find({}, {Title:true, Image: true, Rate: true, Cost: true, Date: true}, {sort: {Date: -1}, limit: 25}).toArray(function(err, result) {

            console.log(result);

            next(result);

        });

    },

    getRates: function(filter, next) {

        try {

            var regexp = new RegExp(filter);

            BR.Rates.Collection.find({Title: regexp}, {Title: true, Image: true, Rate: true, Cost: true, Date: true}, {
                sort: {Date: 1},
                limit: 10
            }).toArray(function (err, result) {

                next(result);

            });

        } catch(e) {



        }

    }

});

