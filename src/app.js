var serverTesterApp = angular.module('SERVERTESTER', []);
//console.log("app start")
serverTesterApp.config(['$routeProvider',function ($routeProvider, $locationProvider) {
    //$locationProvider.html5Mode(true);
    $routeProvider.
        when('/login', {templateUrl: 'templates/login.html', controller: loginCtrl}).
        when('/logout', {templateUrl: 'templates/logout.html', controller: logoutCtrl}).
        when('/serverTester/home', { templateUrl: 'templates/home.html', controller: mainCtrl}).
        when('/serverTester/itemMap', { templateUrl: 'templates/tests.html', controller: itemMapTestCtrl}).
        otherwise({ redirectTo: '/login' });
}]);

//******************************************
// Rootscope Setup
//********************************************
serverTesterApp.run(function ($rootScope) {
    $rootScope.clientSessionId = Math.floor(Math.random()*10000);
    //$rootScope.awsUrl = 'http://54.225.66.110:8001/truck/getData';
    //$rootScope.nodeUrl = 'http://trucklisting.azurewebsites.net';

    // $rootScope.nodeUrl = 'http://127.0.0.1:8080';
    if(location.host == 'local' || location.host == 'localhost')
        $rootScope.nodeUrl = 'http://127.0.0.1:8090/';
    else
        $rootScope.nodeUrl = 'http://servertester-mccord.rhcloud.com/';
});