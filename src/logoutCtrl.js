function logoutCtrl($rootScope, $scope, $location, $http){

	$scope.logoutStatus = 'notStarted';

	$scope.loginAgain = function(){
		$location.path('/login');
	}

	$scope.logout = function(){
		$http.post($rootScope.nodeUrl + '/user/logout', {}).success(function(data){
			$scope.logoutStatus = 'success';
		}).error(function(data){
			$scope.logoutStatus = "error";
		});
	}
	$scope.logoutStatus = 'processing';
	$scope.logout();
}