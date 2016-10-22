angular.module('bestrate').service('ConnectionSrv', ['$rootScope', function($rootScope) {

    var _this = this;

    this.connect = function(main_scope) {

        this.Socket = new WebSocket('ws://localhost:3000');

        this.Socket.onopen = function() {

            console.info("# Web Socket: connection established.");

        };

        this.Socket.onclose = function() {

            console.info("# Web Socket: connection closed.");

        };

        this.Socket.onmessage = function(event) {

            console.log("# Web Socket: receive data " + event.data);

            var data = JSON.parse(event.data);
            if (!data) return console.error('# Web Socket: fail parse server data' + event.data);

            if (data.Rates) $rootScope.RatesSrv.setRates(data.Rates);

            //Так как мы используем внешнее событие - вручную запускаем обновление scope
            if (main_scope.$root.$$phase != '$apply' && main_scope.$root.$$phase != '$digest') main_scope.$apply();

        };

        this.Socket.onerror = function(err) {

            console.error(err);

        };


    };

    this.send = function(data) {

        this.Socket.send(JSON.stringify(data));

    };

}]);
