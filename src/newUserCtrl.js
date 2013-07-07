function NewUserCtrl($rootScope, $scope, $location, $http){
	$scope.user = new Object();
	console.log('in new user')
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

	$scope.checkPassword = function(pass1, pass2){
		if(pass1 == '' || pass2 == ''){
			return;
		}else{
			if(pass1 != pass2)
				$scope.passwordGood = 'bad';
			else
				$scope.passwordGood = 'good';
		}
	}

	$scope.submitUser = function(){
		if($scope.passwordGood == 'good')
			$scope.user.password = $scope.user.password2;
		else
			return;
		if($scope.user.username == '' || $scope.user.password == '' || $scope.user.email == '' || $scope.user.firstName == '' || 
			$scope.user.lastName == '' || $scope.user.sq1 == '' || $scope.user.sa1 == '' || $scope.user.sq2 == '' || 
			$scope.user.sa2 == '' || $scope.user.sq3 == '' || $scope.user.sa3 == '')
			return;
		$http.put($rootScope.nodeUrl + '/user/new', $scope.user).success(function(data){
			$location.path('/serverTester/home');
		}).error(function(data, status, headers, config){
			console.log('error', data, status, headers, config);
		});
	}
}