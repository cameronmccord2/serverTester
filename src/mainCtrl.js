function mainCtrl($scope, $routeParams, $rootScope, $http, $location, $q){
    $scope.applications = new Array();
    $scope.applications.push({name:'Item Map', route:'/serverTester/itemMap'});

    $scope.goToTest = function(route){
        $location.path(route);
    }
}
