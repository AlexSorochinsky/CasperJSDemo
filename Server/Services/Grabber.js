BR.Grabber = new Service({

    Name: 'Grabber',

    initialize: function () {

        this.Query = [];

        this.Data = [];

    },

    run: function () {

        this.runCasperjsProcess();

        setInterval(function () {

            BR.Grabber.runCasperjsProcess();

        }, 3600 * 1000);

    },

    runCasperjsProcess: function () {

        var spawn = require('child_process').spawn;
        var prc = spawn('casperjs', ['Server/Casper.js']);

        prc.stdout.setEncoding('utf8');
        prc.stdout.on('data', function (data) {
            var str = data.toString()
            var lines = str.split(/(\r?\n)/g);
            console.log(lines.join(""));
        });

        prc.on('close', function (code) {

            console.log('Casperjs process exit code ' + code);

            BR.Rates.updateTopRatesCache();

        });

    },

    startGrabbing: function () {

        BR.Grabber.openPage('http://ebay.com', '.ddcrd.daily-deal', {}, function () {

            var result = this.evaluate(function () {

                var result = [];

                var new_rates_holders = document.querySelectorAll('div#dailyDeals div.ddcrd.daily-deal');

                for (var i = 0; new_rates_holders[i]; i++) {

                    var item = {};

                    item.title = new_rates_holders[i].querySelector('a span.tl').innerText;

                    item.cost = new_rates_holders[i].querySelector('div.info').innerText;

                    item.image = new_rates_holders[i].querySelector('div.icon img').getAttribute('src');

                    item.url = new_rates_holders[i].querySelector('a.clr').getAttribute('href');

                    result.push(item);

                }

                return result;

            });

            console.log('222222222222', JSON.stringify(result));

            BR.Grabber.Query = result || [];

            BR.Grabber.processQuery();

        });

    },

    processQuery: function () {

        var item = this.Query[0];

        console.log('processQuery', this.Query.length);

        if (item) {

            this.Query.splice(0, 1);

            BR.Grabber.openPage(item.url, 'img#gh-logo', {loadImages: false}, function () {

                console.log('aaa 1');

                var result = this.evaluate(function () {

                    var item = {};

                    item.title = document.querySelectorAll('h1.it-ttl').length;

                    item.rate = document.querySelectorAll('span.vi-core-prdReviewCntr i.fullStar').length;

                    item.date = new Date();

                    return item;

                });

                console.log('aaa 2', result);

                result.image = item.image;

                result.cost = item.cost;

                console.log('11111111111', JSON.stringify(result));

                BR.Grabber.Data.push(result);

                BR.Grabber.processQuery();

            });

        } else {

            console.log('complete');

            BR.Grabber.sendToServer({
                'Source': 'ebay.com',
                'Rates': this.Data
            });

        }

    },

    openPage: function (url, selector, options, next) {

        if (options.loadImages === false) {

            BR.Casper.options.pageSettings = {
                loadImages:  false,
                loadPlugins: false
            }

        } else {

            BR.Casper.options.pageSettings = {
                loadImages:  true,
                loadPlugins: true
            }

        }

        BR.Casper.start(url);

        console.log('openPage', url);

        BR.Casper.then(function () {

            BR.Casper.waitFor(function () {

                //console.log('wait ');

                var data = this.evaluate(function (selector) {
                    return {
                        //body: document.body.innerHTML,
                        test: document.querySelectorAll('div').length,
                        //result: document.querySelectorAll('div').length > 10
                        result: document.querySelectorAll(selector).length > 0
                    };
                }, {
                    selector: selector
                });

                console.log('waitFor result', JSON.stringify(data));

                return data.result;

            }, function () {

                this.echo('Elements successfully found');

            }, function () {

                this.echo('Time is over');

            }, 5000);

        });

        BR.Casper.run(function () {

            this.echo('BR.Casper.run');

            next.apply(this, []);

        });

    },

    sendToServer: function (data) {

        console.log('data', data, BR.Config.Url + ':' + BR.Config.Port + '/Rates/add');

        setTimeout(function () {

            BR.Casper.done();

        }, 5000);

        BR.Casper.open(BR.Config.Url + ':' + BR.Config.Port + '/Rates/add', {
            method: 'POST',
            encoding: "utf8",
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            },
            data: data
        });

    }

});

