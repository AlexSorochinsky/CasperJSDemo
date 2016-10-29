angular.module('bestrate').controller('MainCtrl', ['$rootScope', '$scope', 'RatesSrv', 'ConnectionSrv', function ($rootScope, $scope, RatesSrv, ConnectionSrv) {

    $rootScope.ConnectionSrv = ConnectionSrv;

    $rootScope.RatesSrv = RatesSrv;

    $scope.Math = Math;

    ConnectionSrv.connect($scope);

}]);
