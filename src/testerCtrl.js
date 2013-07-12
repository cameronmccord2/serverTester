function TesterCtrl($rootScope, $scope, $location, $routeParams, $http, $q){
	var serverPath = "http://localhost:8909/";
	$scope.stopTest = false;
	$scope.testStatuses = {
		good:'good',
		bad:'bad'
	};
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
	$scope.resultsArray = new Array();

	$scope.makeDbName = function(){
	    $scope.dbName = "";
	    var possible = "abcdefghijklmnopqrstuvwxyz";
	    for( var i=0; i < 10; i++ )
	        $scope.dbName += possible.charAt(Math.floor(Math.random() * possible.length));
	}

	var call = {
		get:function(path, params){
			console.log("here", path, params)
			var config = undefined;
			if(params != undefined)
				config = {
					params:params
				};
			var defer = $q.defer();
			$http.get(path, config).success(function(data, status, headers, config){
				defer.resolve({data:data, status:status, headers:headers, config:config});
			}).error(function(data, status, headers, config){
				defer.resolve({data:data, status:status, headers:headers, config:config});
			});
			return defer.promise;
		}
	}

	$scope.sequence.login = function(newLogin){
		return call.get(serverPath + 'map1/user/login', newLogin);
	}
	$scope.sequence.checkUsername = function(usernameObject){
		return call.get(serverPath + 'map1/doesUsernameExist', usernameObject);
	}
	$scope.sequence.newUser = function(newUser){
		return call.get(serverPath + 'map1/user/new', newUser);
	}
	$scope.sequence.userData = function(token){
		return call.get(serverPath + 'map/user/data', token);
	}


	var evaluateResult = function(result, valid, data, status, headers, config){
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
	var runTest = function(sequence, category, testTitle, inputData, data, status, headers, config){
		console.log(sequence, category, testTitle, inputData, data, status, headers, config)
		var defer = $q.defer();
		var validResult = "Valid";
		inputData.token = $scope.currentToken;
		inputData.useDatabase = $scope.dbName;
		console.log(inputData)
		$scope.sequence[sequence](inputData).then(function(result){
			var testResult = evaluateResult(result, validResult, data, status, headers, config);
			if(result.data.token != undefined){
				$scope.currentToken = result.data.token;
				console.log("saved current token", result.data.token)
			}
			var statusClass = $scope.testStatuses.bad;
			if(testResult.resultString == validResult)
				statusClass = $scope.testStatuses.good;
			console.log({testStatus:statusClass, sequence:sequence, category:category, testTitle:testTitle, inputData:inputData, result:result, data:data, status:status, headers:headers, config:config});
			$scope.resultsArray.push({testStatus:statusClass, sequence:sequence, category:category, testTitle:testTitle, inputData:inputData, result:result, data:data, status:status, headers:headers, config:config});
			defer.resolve(testResult);
		});
		return defer.promise;
	}

	$scope.testLoop = function(testIndex){
		var buildString = '';
		$scope.currentDefer = $q.defer();
		for (var i = 0; i < $scope.tests[testIndex].tests.length; i++) {
			console.log("hit loop")
			if($scope.stopTest){
				$scope.stopTest = false;
				break;
			}else{
				//eval('runTest($scope.tests["' + testIndex + '"].sequence, $scope.tests["' + testIndex + '"].category, $scope.tests["' + testIndex + '"].tests["' + i + '"][0], $scope.tests["' + testIndex + '"].tests["' + i + '"][1], $scope.tests["' + testIndex + '"].tests["' + i + '"][2], $scope.tests["' + testIndex + '"].tests["' + i + '"][3], $scope.tests["' + testIndex + '"].tests["' + i + '"][4]);');
				buildString += 'runTest($scope.tests["' + testIndex + '"].sequence, $scope.tests["' + testIndex + '"].category, $scope.tests["' + testIndex + '"].tests["' + i + '"][0], $scope.tests["' + testIndex + '"].tests["' + i + '"][1], $scope.tests["' + testIndex + '"].tests["' + i + '"][2], $scope.tests["' + testIndex + '"].tests["' + i + '"][3], $scope.tests["' + testIndex + '"].tests["' + i + '"][4])';
				if(i != $scope.tests[testIndex].tests.length - 1)
					buildString += '.then(function(){';
				else{
					buildString += '.then(function(){$scope.currentDefer.resolve()';
					for (var i = 0; i < $scope.tests[testIndex].tests.length; i++) {
						buildString += ';})';
					}
				}
			}
		};
		console.log(buildString + ';');
		eval(buildString + ';');
		return $scope.currentDefer.promise;
	}

	$scope.tests = [
		{
			category:"Login when user isnt present",
			sequence:"login",
			tests:[
				['No Data', {}, 'Missing token: username', 401],
				['Username', {username:"stuff"}, 'Missing token: password', 401],
				['Good Login', {username:"username", password:"password"}, 'usernameInvalid', 400]
			]
		},
		{
			category:"Create User",
			sequence:'newUser',
			tests:[
				['No Data', {}, 'Missing token: firstName', 401],
				['First Name', {firstName:"cam"}, 'Missing token: lastName', 401],
				['Last Name', {firstName:"cam", lastName:"McCord"}, 'Missing token: email', 401],
				['Username', {firstName:"cam", lastName:"McCord", username:"username"}, 'Missing token: email', 401],
				['Password', {firstName:"cam", lastName:"McCord", username:"username", password:"password"}, 'Missing token: email', 401],
				['Valid User', {firstName:"cam", lastName:"McCord", username:"username", password:"password", email:"cameronmccord2@gmail.com"}, undefined, 200],
				['Existing User', {firstName:"cam", lastName:"McCord", username:"username", password:"password", email:"cameronmccord2@gmail.com"}, "Username already exists", 401]
			]
		},
		{
			category:"Login",
			sequence:"login",
			tests:[
				['No Data', {}, 'Missing token: username', 401],
				['Username', {username:"stuff"}, 'Missing token: password', 401],
				['Good Login', {username:"username", password:"password"}, undefined, 200]
			]
		},
		{
			category:"User Data",
			sequence:"userData",
			tests:[
				['No Data', {}, undefined, 200]// token added to all outbound calls
			]
		}
	];
	$scope.makeDbName();
	$scope.testLoop(0).then(function(){$scope.testLoop(1).then(function(){$scope.testLoop(2).then(function(){$scope.testLoop(3);});});});
	//$scope.testLoop(1).then(function(){$scope.testLoop(2)});
	// $scope.testLoop(2);
}

















































