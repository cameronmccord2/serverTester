function mainCtrl($scope, $routeParams, $rootScope, $http, $location, $q){
    $scope.applications = new Array();
    $scope.applications.push({name:'Item Map', route:'/serverTester/itemMap'});
    $scope.applications.push({name:'Test1', route:'/serverTester/test1'});

    $scope.goToTest = function(route){
        $location.path(route);
    }
}
