"use strict";

var BR = global.BR = {};

BR.Config = require('Config/Config');

BR.Casper = require('casper').create({
    //verbose: true,
    //logLevel: 'debug'
});

BR.Casper.options.viewportSize = {width: 1920, height: 1080};

BR.Casper.options.timeout = 100000;
BR.Casper.options.retryTimeout = 100000;
BR.Casper.options.waitTimeout = 100000;

console.log('BR.Casper.options', JSON.stringify(BR.Casper.options));

var _ = global._ = require('underscore');

require('/Classes/Service');
require('/Classes/Broadcast');

require('/Services/Grabber');

BR.Grabber.startGrabbing();