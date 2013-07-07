var serverTesterApp = angular.module('SERVERTESTER', []);
//console.log("app start")
serverTesterApp.config(['$routeProvider',function ($routeProvider, $locationProvider) {
    //$locationProvider.html5Mode(true);
    $routeProvider.
        when('/login', {templateUrl: 'templates/login.html', controller: loginCtrl}).
        when('/logout', {templateUrl: 'templates/logout.html', controller: logoutCtrl}).
        when('/newUser', {templateUrl: 'templates/newUser.html', controller: NewUserCtrl}).
        when('/serverTester/home', { templateUrl: 'templates/home.html', controller: mainCtrl}).
        when('/serverTester/itemMap', { templateUrl: 'templates/tests.html', controller: itemMapTestCtrl}).
        when('/serverTester/map', {templateUrl: 'templates/tester.html', controller: TesterCtrl}).
        otherwise({ redirectTo: '/serverTester/map' });
}]);

//******************************************
// Rootscope Setup
//********************************************
serverTesterApp.run(function ($rootScope) {
    $rootScope.clientSessionId = Math.floor(Math.random()*10000);
    //$rootScope.awsUrl = 'http://54.225.66.110:8001/truck/getData';
    //$rootScope.nodeUrl = 'http://trucklisting.azurewebsites.net';

    // $rootScope.nodeUrl = 'http://127.0.0.1:8080';
    console.log(location.host)
    if(location.host == 'local' || location.host == 'localhost:8090')
        $rootScope.nodeUrl = 'http://127.0.0.1:8090/serverTester';
    else
        $rootScope.nodeUrl = 'http://servertester-mccord.rhcloud.com/serverTester';
});