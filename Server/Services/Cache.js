/**
 * Created by alya on 27.08.16.
 */

BR.Cache = new Service({

    Name: 'Cache',

    initialize: function() {

        this._caches = {};

    },

    create: function(name, fn) {

        //Помечаем что нужно ждать кэширования
        this._caches[name] = false;

        fn(_.bind(function() {

            this._caches[name] = true;

            this.checkReady();

        }, this));

    },

    checkReady: function() {

        if (_.size(this._caches) == _.size(_.filter(this._caches, function(v) {return v;}))) {

            Broadcast.call('Database Cache Ready');

        }

    }

});