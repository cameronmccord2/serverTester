function TesterCtrl($rootScope, $scope, $location, $routeParams, $http){
	var serverPath = "http://localhost:8909/"
	var user = {
		firstName:'',
		lastName:'',
		username:'',
		password:'',
		email:''
	};
	var login = {
		username:'',
		password:''
	};

	var sequence = new Object();
	sequence.login = function(){
		$http.get(serverPath + 'map/user/login', query).success(function(data){
			$scope.login = data;
			$scope.loginString = angular.toJson(data);
		}).error(function(data, status, headers, config){
			console.log("error logging in", data, status, headers, config);
		})
	}
}