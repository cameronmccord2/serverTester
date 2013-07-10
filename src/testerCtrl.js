function TesterCtrl($rootScope, $scope, $location, $routeParams, $http, $q){
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
	$scope.tests = new Array();
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
	$scope.sequence.newUser = function(newUser){
		var config = {
			params:newUser
		}
		var defer = $q.defer();
		$http.get(serverPath + 'map1/user/new', config).success(function(data, status, headers, config){
			defer.resolve({data:data, status:status, headers:headers, config:config});
		}).error(function(data, status, headers, config){
			console.log("newuser", data, status, headers, config);
			defer.resolve({data:data, status:status, headers:headers, config:config});
		});
		return defer.promise;
	}
	var testResult = function(result, valid, data, status, headers, config){
		var resultString = '';
		var extra = false;
		if(data != undefined){
			if(result.data != data)
				resultString += 'Data invalid, expected: ' + angular.toJson(data) + ' GOT ' + angular.toJson(result.data) + '\n';
		}
		if(status != undefined){
			if(result.status != status)
				resultString += 'Status invalid, expected: ' + angular.toJson(status) + ' GOT ' + angular.toJson(result.status) + '\n';
		}
		if(headers != undefined){
			if(result.headers != headers){
				extra = true;
				resultString += 'Headers invalid, expected: ' + angular.toJson(headers) + ' GOT ' + angular.toJson(result.headers) + '\n';
			}
		}
		if(config != undefined){
			if(result.config != config){
				extra = true;
				resultString += 'Config invalid, expected: ' + angular.toJson(config) + ' GOT ' + angular.toJson(result.config) + '\n';
			}
		}
		if(resultString != ''){
			if(!extra)
				resultString += 'Headers: ' + angular.toJson(headers) + '\nConfig: ' + angular.toJson(config);
		}else
			resultString = valid;
		return {resultString:resultString, result:result, expected:{data:data, status:status, headers:headers, config:config}};

	}
	$scope.tests[0] = {
		name:"Create User",
		tests:[
			function(){
				var defer = $q.defer();
				$scope.sequence.newUser().then(function(result){
					var testResult = testResult(result, 'Valid', 'Missing token: firstName', 401);
					if(testResult != 'Valid')
						console.log(testResult);
					defer.resolve(testResult);
				});

				return defer.promise;
			},
			function(){

			}
		]
	}
	$scope.tests[0].tests[0]();
}