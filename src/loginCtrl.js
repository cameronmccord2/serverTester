function loginCtrl($rootScope, $scope, $location, $http){
	
	$scope.loginMessage = '';
	$scope.doesUsernameExist = 'unknown';
	$scope.showLoginInput = true;
	$scope.user = new Object();

	$scope.login = function(username, password){
		$scope.loginMessage = 'Processing';
		$scope.showLoginInput = false;
		if(username != undefined && username != null && username != '' && password != undefined && password != null && password != ''){
			$scope.loginMessage = 'Username or password is invalid';
			$scope.showLoginInput = true;
		}else{
			$http.post($rootScope.nodeUrl + '/user/login', {username:username, password:password}).success(function(data){
				$scope.showLoginInput = false;
				$scope.loginMessage = 'Login Success';
				$location.path('/serverTester/home');
			}).error(function(data, status, headers, config){
				$scope.showLoginInput = true;
				if(status == 401)
					$scope.loginMessage = 'Login failure, username or password is incorrect';
				else
					$scope.loginMessage = 'Login failure, there was a server error. Try again now or later';
			});
		}
	}

	$scope.checkUsername = function(username){
		$scope.doesUsernameExist = 'pending';
		$http.post($rootScope.nodeUrl + '/user/doesUsernameExist', {username:username}).success(function(data){
			if(data == 'doesntExist')
				$scope.doesUsernameExist = 'no';
			else if(data == 'exists')
				$scope.doesUsernameExist = 'yes';
			else
				$scope.doesUsernameExist = 'serverError';
		}).error(function(data){
			$scope.doesUsernameExist = 'serverError';
		});
	}
}