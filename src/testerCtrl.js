function TesterCtrl($rootScope, $scope, $location, $routeParams, $http){
	var serverPath = "http://localhost:8909/";
	$scope.input = new Object();
	$scope.newUser = {
		firstName:'',
		lastName:'',
		username:'',
		password:'',
		email:''
	};
	$scope.login = {
		username:'',
		password:''
	};
	$scope.sequence = new Object();
	$scope.sequence.login = function(username, password){
		console.log("trying to login")
		var config = {
			params:{
				username: username,
				password: password
			}
		};
		$http.get(serverPath + 'map1/user/login', config).success(function(data){
			$scope.login = data;
			$scope.loginString = data.token.length;
			console.log(data);
		}).error(function(data, status, headers, config){
			if(status == 0)
				console.log("server not there: " + serverPath);
			console.log("error logging in", data, status, headers, config);
		});
	}
	$scope.sequence.checkUsername = function(username){
		if(username == '')
			return;
		var config = {
			params:{
				username: username
			}
		};
		$http.get(serverPath + 'map1/doesUsernameExist', config).success(function(data){
			if(data == 'doesntExist')
				$scope.input.usernameGood = true;
			else if(data == 'exists')
				$scope.input.usernameGood = false;
		}).error(function(data, status, headers, config){
			
		});
	}
	$scope.sequence.newUser = function(){
		var config = {
			params:$scope.newUser
		}
		$http.get(serverPath + 'map1/user/new', config).success(function(data){
			$scope.newUser.string = "success";
		}).error(function(data, status, headers, config){
			console.log("error setting up new user", data, status, headers, config);
			$scope.newUser.string = "failure" + angular.toJson(data);
		});
	}
}