angular.module('bestrate', ['ngRoute']);

angular.module('bestrate').config(['$routeProvider', function($routeProvider) {

    $routeProvider
        .when('/12345', {
            template: '<12345></12345>'
        })
        .when('/', {
            template: '<landing-page></landing-page>'
        })
        .otherwise(function ($injector, $location) {
            $location.path('/').replace();
        });

}]);

angular.module('bestrate').config(['$locationProvider', function($locationProvider) {

    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });

}]);

var App = {};

App.width = 1920;

App.scale = 1;

App.resize = function() {

    var width = window.innerWidth;

    this.scale = Math.min(1, width / 768);

    if (width < 500) {

        this.width = 0.95 * width;

    } else {

        this.width = 0.8 * width;

    }

    if (this.width > 600) this.width = 600;

    this.applyScale(document.body);

};

App.applyScale = function(el) {

    var els = $(el).find('[stl]');

    els.push(el);

    _.each(els, function(el) {

        var stl = $(el).attr('stl');

        if (stl) {

            var styles = stl.split(',');

            _.each(styles, function (style) {

                var parts = style.split(':');

                var name = parts[0];

                var value_string = parts[1];

                var values = value_string.split(' '),
                    value = '';

                if (values[0] == 'calc') {

                    value = 'calc(' + this.transformValue(values[1]) + ' ' + this.transformValue(values[2]) + ')';

                } else {

                    value = _.map(values, function (v) {
                        return App.transformValue(v)
                    }).join(' ');

                }

                //console.log(el, name, value);

                $(el).css(name, value);

            }, this);

        }

    }, this);

};

App.transformValue = function(value) {

    if (value == '#width') return this.width;

    if (value.indexOf('%') != -1) return value;

    if (value == 'auto') return value;

    return parseFloat(value) * this.scale + 'px';

};

window.addEventListener('resize', function() {

    App.resize();

});

App.resize();