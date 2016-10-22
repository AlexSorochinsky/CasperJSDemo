angular.module('bestrate').controller('MainCtrl', ['$rootScope', '$scope', 'RatesSrv', 'ConnectionSrv', function ($rootScope, $scope, RatesSrv, ConnectionSrv) {

    $rootScope.ConnectionSrv = ConnectionSrv;

    $rootScope.RatesSrv = RatesSrv;

    $scope.Math = Math;

    $scope.scale = 1;

    $scope.width = 0;

    $scope.recalculateScale = function() {

        var width = window.innerWidth;

        $scope.scale = Math.min(1, width / 768);

        if (width < 500) {

            $scope.width = 0.95 * width;

        } else {

            $scope.width = 0.8 * width;

        }

        if ($scope.width > 600) $scope.width = 600;

        //Так как мы используем внешнее событие - вручную запускаем обновление scope
        if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') $scope.$apply();

    };

    window.addEventListener('resize', function() {

        $scope.recalculateScale();

    });

    $scope.recalculateScale();

    ConnectionSrv.connect($scope);

}]);
