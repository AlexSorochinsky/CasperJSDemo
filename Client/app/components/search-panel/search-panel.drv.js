angular.module('bestrate').directive('searchPanel', [function() {

    return {

        restrict: 'EA',

        replace: true,

        templateUrl: 'app/components/search-panel/search-panel.htm',

        link: function(scope, el, attrs) {

            App.applyScale(el);

        },

        controller: ['$scope', function($scope) {

            $scope.$watch('searchString', function (newValue) {

                $scope.RatesSrv.setFilter(newValue);

            }.bind(this));

        }]

    };

}]);
