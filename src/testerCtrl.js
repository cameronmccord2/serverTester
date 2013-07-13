function TesterCtrl($rootScope, $scope, $location, $routeParams, $http, $q, $window){
	var serverPath = "http://localhost:8909/";
	$scope.stopTest = false;
	$scope.showGoodTests = false;
	$scope.stopTesting = false;
	$scope.repeaterOrder = false;
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

	$scope.reloadPage = function(){
		$window.location.reload(true);
	}

	$scope.howManyTests = function(what){
		var howMany = 0;
		for (var i = $scope.resultsArray.length - 1; i >= 0; i--) {
			if($scope.resultsArray[i].testStatus == what)
				howMany++;
		};
		return howMany;
	}

	$scope.showTestInRepeater = function(status){
		if(status == 'bad')
			return true;
		if(status == 'good' && $scope.showGoodTests)
			return true;
	}

	$scope.makeRandomString = function(howLong){
		var name = "";
		var possible = "abcdefghijklmnopqrstuvwxyz";
	    for(var i = 0; i < howLong; i++)
	        name += possible.charAt(Math.floor(Math.random() * possible.length));
	    return name;
	}

	$scope.makeRandomValidToken = function(howLong){
		if(howLong < 8)
			return $scope.makeRandomString(howLong);
		else
			return $scope.makeRandomString(howLong - 8) + 'zzzzzzzz';
	}

	$scope.makeRandomInvalidToken = function(howLong){
		if(howLong < 8)
			return $scope.makeRandomString(howLong);
		else
			return $scope.makeRandomString(howLong - 8) + 'aaaaaaaa';
	}

	$scope.runDifferentTestList = function(from, to){
		$location.path('serverTester/map/' + from + '/' + to);
	}

	$scope.makeDbName = function(){
	    $scope.dbName = $scope.makeRandomString(10);
	}

	var call = {
		get:function(path, params){
			//console.log("here", path, params)
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
		},
		put:function(path, body, params){
			var config = undefined;
			if(params != undefined)
				config = {
					params:params
				};
			var defer = $q.defer();
			$http.put(path, body, config).success(function(data, status, headers, config){
				defer.resolve({data:data, status:status, headers:headers, config:config});
			}).error(function(data, status, headers, config){
				defer.resolve({data:data, status:status, headers:headers, config:config});
			});
			return defer.promise;
		}
	}

	$scope.sequence.login = function(newLogin){
		return call.get(serverPath + 'map/user/login', newLogin);
	}
	$scope.sequence.logout = function(logoutData){
		return call.get(serverPath + 'map/user/logout', logoutData);
	}
	$scope.sequence.checkUsername = function(usernameObject){
		return call.get(serverPath + 'map/doesUsernameExist', usernameObject);
	}
	$scope.sequence.newUser = function(newUser){
		return call.get(serverPath + 'map/user/new', newUser);
	}
	$scope.sequence.userData = function(data){
		return call.get(serverPath + 'map/user/data', data);
	}
	$scope.sequence.dumb = function(data){
		return call.get(serverPath + 'map/dumb', data);
	}
	$scope.sequence.newItem = function(data){
		return call.put(serverPath + 'map/item/new', data);
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
		if($scope.stopTesting)
			return;
		console.log(sequence, category, testTitle, inputData, data, status, headers, config)
		var defer = $q.defer();
		var validResult = "Valid";
		if(inputData.token == undefined)
			inputData.token = $scope.currentToken;
		inputData.useDatabase = $scope.dbName;
		// inputData.useDatabase = "asdf";
		//console.log(inputData)

		$scope.sequence[sequence](inputData).then(function(result){
			var testResult = evaluateResult(result, validResult, data, status, headers, config);
			if(result.data.token != undefined){
				$scope.currentToken = result.data.token;
				//console.log("saved current token", result.data.token)
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
			//console.log("hit loop")
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
					for (var j = 0; j < $scope.tests[testIndex].tests.length; j++) {
						buildString += ';})';
					}
				}
			}
		};
		//console.log(buildString + ';');
		eval(buildString + ';');
		return $scope.currentDefer.promise;
	}

	$scope.runTests = function(from, to){
		var buildString = '';
		for (var i = from; i < to; i++) {
			buildString += '$scope.testLoop(' + i + ')';
			if(i != to - 1)
				buildString += '.then(function(){';
			else
				for (var j = from; j < to - 1; j++)
					buildString += ';})';
		};
		console.log(buildString + ';');
		eval(buildString + ';');
	}

	$scope.tests = [
		{
			category:"Check Username, shouldnt exist",
			sequence:"checkUsername",
			tests:[
				['No Data', {}, 'Missing username', 400],
				['Username missing', {username:$scope.makeRandomString(0)}, 'Missing username', 400],
				['Garbage Username, short', {username:$scope.makeRandomString(1)}, 'Username too short, should be more than 5', 400],
				['Garbage Username, short', {username:$scope.makeRandomString(2)}, 'Username too short, should be more than 5', 400],
				['Garbage Username, short', {username:$scope.makeRandomString(3)}, 'Username too short, should be more than 5', 400],
				['Garbage Username, short', {username:$scope.makeRandomString(4)}, 'Username too short, should be more than 5', 400],
				['Garbage Username', {username:$scope.makeRandomString(5)}, 'doesntExist', 200],
				['Garbage Username, start with number', {username:'1' + $scope.makeRandomString(5)}, 'Username cant start with a number', 400],
				['Garbage Username', {username:$scope.makeRandomString(6)}, 'doesntExist', 200],
				['Garbage Username, start with number', {username:'1' + $scope.makeRandomString(6)}, 'Username cant start with a number', 400],
				['Garbage Username', {username:$scope.makeRandomString(7)}, 'doesntExist', 200],
				['Garbage Username, start with number', {username:'1' + $scope.makeRandomString(7)}, 'Username cant start with a number', 400],
				['Garbage Username', {username:$scope.makeRandomString(8)}, 'doesntExist', 200],
				['Garbage Username, start with number', {username:'1' + $scope.makeRandomString(8)}, 'Username cant start with a number', 400],
				['Garbage Username', {username:$scope.makeRandomString(9)}, 'doesntExist', 200],
				['Garbage Username, start with number', {username:'1' + $scope.makeRandomString(9)}, 'Username cant start with a number', 400],
				['Garbage Username', {username:$scope.makeRandomString(10)}, 'doesntExist', 200],
				['Garbage Username, start with number', {username:'1' + $scope.makeRandomString(10)}, 'Username cant start with a number', 400],
				['Garbage Username', {username:$scope.makeRandomString(11)}, 'doesntExist', 200],
				['Garbage Username, start with number', {username:'1' + $scope.makeRandomString(11)}, 'Username cant start with a number', 400],
				['Garbage Username', {username:$scope.makeRandomString(12)}, 'doesntExist', 200],
				['Garbage Username, start with number', {username:'1' + $scope.makeRandomString(12)}, 'Username cant start with a number', 400],
				['Garbage Username', {username:$scope.makeRandomString(13)}, 'doesntExist', 200],
				['Garbage Username, start with number', {username:'1' + $scope.makeRandomString(13)}, 'Username cant start with a number', 400],
				['Garbage Username', {username:$scope.makeRandomString(14)}, 'doesntExist', 200],
				['Garbage Username, start with number', {username:'1' + $scope.makeRandomString(14)}, 'Username cant start with a number', 400],
				['Garbage Username', {username:$scope.makeRandomString(15)}, 'doesntExist', 200],
				['Garbage Username, start with number', {username:'1' + $scope.makeRandomString(15)}, 'Username cant start with a number', 400],
				['Garbage Username', {username:$scope.makeRandomString(16)}, 'doesntExist', 200],
				['Garbage Username, start with number', {username:'1' + $scope.makeRandomString(16)}, 'Username cant start with a number', 400],
				['Garbage Username', {username:$scope.makeRandomString(17)}, 'doesntExist', 200],
				['Garbage Username, start with number', {username:'1' + $scope.makeRandomString(17)}, 'Username cant start with a number', 400],
				['Garbage Username', {username:$scope.makeRandomString(18)}, 'doesntExist', 200],
				['Garbage Username, start with number', {username:'1' + $scope.makeRandomString(18)}, 'Username cant start with a number', 400],
				['Garbage Username', {username:$scope.makeRandomString(19)}, 'doesntExist', 200],
				['Garbage Username, start with number', {username:'1' + $scope.makeRandomString(19)}, 'Username too long, should be less than 20', 400],
				['Garbage Username, too long', {username:$scope.makeRandomString(20)}, 'Username too long, should be less than 20', 400],
				['Garbage Username, start with number, too long', {username:'1' + $scope.makeRandomString(20)}, 'Username too long, should be less than 20', 400],
				['Garbage Username, too long', {username:$scope.makeRandomString(21)}, 'Username too long, should be less than 20', 400],
				['Garbage Username, start with number, too long', {username:'1' + $scope.makeRandomString(21)}, 'Username too long, should be less than 20', 400],
				['Garbage Username, too long', {username:$scope.makeRandomString(22)}, 'Username too long, should be less than 20', 400],
				['Garbage Username, start with number, too long', {username:'1' + $scope.makeRandomString(22)}, 'Username too long, should be less than 20', 400],
				['Garbage Username, too long', {username:$scope.makeRandomString(23)}, 'Username too long, should be less than 20', 400],
				['Garbage Username, start with number, too long', {username:'1' + $scope.makeRandomString(23)}, 'Username too long, should be less than 20', 400],
				['Garbage Username, too long', {username:$scope.makeRandomString(24)}, 'Username too long, should be less than 20', 400],
				['Garbage Username, start with number, too long', {username:'1' + $scope.makeRandomString(24)}, 'Username too long, should be less than 20', 400],
				['Garbage Username, too long', {username:$scope.makeRandomString(25)}, 'Username too long, should be less than 20', 400],
				['Garbage Username, start with number, too long', {username:'1' + $scope.makeRandomString(25)}, 'Username too long, should be less than 20', 400]
			]
		},
		{
			category:"Invalid tokens",
			sequence:"dumb",
			tests:[
				['No Data', {}, "Missing authorization token", 401],
				['No token', {token:$scope.makeRandomString(0)}, 'Missing authorization token', 401],
				['No token', {token:undefined}, 'Missing authorization token', 401],
				['No token', {token:null}, 'Missing authorization token', 401],
				['No token', {token:''}, 'Missing authorization token', 401],
				['Invalid length token', {token:$scope.makeRandomValidToken(0)}, 'Missing authorization token', 401],
				['Invalid length token', {token:$scope.makeRandomValidToken(1)}, 'Token is not 30 characters long', 401],
				['Invalid length token', {token:$scope.makeRandomValidToken(2)}, 'Token is not 30 characters long', 401],
				['Invalid length token', {token:$scope.makeRandomValidToken(3)}, 'Token is not 30 characters long', 401],
				['Invalid length token', {token:$scope.makeRandomValidToken(4)}, 'Token is not 30 characters long', 401],
				['Invalid length token', {token:$scope.makeRandomValidToken(5)}, 'Token is not 30 characters long', 401],
				['Invalid length token', {token:$scope.makeRandomValidToken(6)}, 'Token is not 30 characters long', 401],
				['Invalid length token', {token:$scope.makeRandomValidToken(7)}, 'Token is not 30 characters long', 401],
				['Invalid length token', {token:$scope.makeRandomValidToken(8)}, 'Token is not 30 characters long', 401],
				['Invalid length token', {token:$scope.makeRandomValidToken(9)}, 'Token is not 30 characters long', 401],
				['Invalid length token', {token:$scope.makeRandomValidToken(10)}, 'Token is not 30 characters long', 401],
				['Invalid length token', {token:$scope.makeRandomValidToken(11)}, 'Token is not 30 characters long', 401],
				['Invalid length token', {token:$scope.makeRandomValidToken(12)}, 'Token is not 30 characters long', 401],
				['Invalid length token', {token:$scope.makeRandomValidToken(13)}, 'Token is not 30 characters long', 401],
				['Invalid length token', {token:$scope.makeRandomValidToken(14)}, 'Token is not 30 characters long', 401],
				['Invalid length token', {token:$scope.makeRandomValidToken(15)}, 'Token is not 30 characters long', 401],
				['Invalid length token', {token:$scope.makeRandomValidToken(16)}, 'Token is not 30 characters long', 401],
				['Invalid length token', {token:$scope.makeRandomValidToken(17)}, 'Token is not 30 characters long', 401],
				['Invalid length token', {token:$scope.makeRandomValidToken(18)}, 'Token is not 30 characters long', 401],
				['Invalid length token', {token:$scope.makeRandomValidToken(19)}, 'Token is not 30 characters long', 401],
				['Invalid length token', {token:$scope.makeRandomValidToken(20)}, 'Token is not 30 characters long', 401],
				['Invalid length token', {token:$scope.makeRandomValidToken(21)}, 'Token is not 30 characters long', 401],
				['Invalid length token', {token:$scope.makeRandomValidToken(22)}, 'Token is not 30 characters long', 401],
				['Invalid length token', {token:$scope.makeRandomValidToken(23)}, 'Token is not 30 characters long', 401],
				['Invalid length token', {token:$scope.makeRandomValidToken(24)}, 'Token is not 30 characters long', 401],
				['Invalid length token', {token:$scope.makeRandomValidToken(25)}, 'Token is not 30 characters long', 401],
				['Invalid length token', {token:$scope.makeRandomValidToken(26)}, 'Token is not 30 characters long', 401],
				['Invalid length token', {token:$scope.makeRandomValidToken(27)}, 'Token is not 30 characters long', 401],
				['Invalid length token', {token:$scope.makeRandomValidToken(28)}, 'Token is not 30 characters long', 401],
				['Invalid length token', {token:$scope.makeRandomValidToken(29)}, 'Token is not 30 characters long', 401],
				['Invalid length token', {token:$scope.makeRandomValidToken(30)}, 'Token does not exist', 401],
				['Invalid length token', {token:$scope.makeRandomValidToken(31)}, 'Token is not 30 characters long', 401],
				['Invalid length token', {token:$scope.makeRandomValidToken(32)}, 'Token is not 30 characters long', 401],
				['Invalid length token', {token:$scope.makeRandomValidToken(33)}, 'Token is not 30 characters long', 401],
				['Invalid length token', {token:$scope.makeRandomValidToken(34)}, 'Token is not 30 characters long', 401],
				['Invalid length token', {token:$scope.makeRandomValidToken(35)}, 'Token is not 30 characters long', 401],
				['Invalid length token', {token:$scope.makeRandomValidToken(36)}, 'Token is not 30 characters long', 401],
				['Invalid length token', {token:$scope.makeRandomValidToken(37)}, 'Token is not 30 characters long', 401],
				['Invalid length token', {token:$scope.makeRandomValidToken(38)}, 'Token is not 30 characters long', 401],
				['Invalid length token', {token:$scope.makeRandomValidToken(39)}, 'Token is not 30 characters long', 401],
				['Invalid length token', {token:$scope.makeRandomValidToken(40)}, 'Token is not 30 characters long', 401],
				['Invalid length token', {token:$scope.makeRandomValidToken(41)}, 'Token is not 30 characters long', 401],
				['Invalid length token', {token:$scope.makeRandomValidToken(42)}, 'Token is not 30 characters long', 401],
				['Invalid length token', {token:$scope.makeRandomValidToken(43)}, 'Token is not 30 characters long', 401],
				['Invalid length token', {token:$scope.makeRandomValidToken(44)}, 'Token is not 30 characters long', 401],
				['Invalid length token', {token:$scope.makeRandomValidToken(45)}, 'Token is not 30 characters long', 401],
				['Invalid length token', {token:$scope.makeRandomValidToken(46)}, 'Token is not 30 characters long', 401],
				['Invalid length token', {token:$scope.makeRandomValidToken(47)}, 'Token is not 30 characters long', 401],
				['Invalid length token', {token:$scope.makeRandomValidToken(48)}, 'Token is not 30 characters long', 401],
				['Invalid length token', {token:$scope.makeRandomValidToken(49)}, 'Token is not 30 characters long', 401],
				['Invalid length token', {token:$scope.makeRandomValidToken(49)}, 'Token is not 30 characters long', 401],
				['Expired Token', {token:$scope.makeRandomInvalidToken(30)}, 'Token is expired', 401],
				['Expired Token', {token:$scope.makeRandomInvalidToken(30)}, 'Token is expired', 401],
				['Expired Token', {token:$scope.makeRandomInvalidToken(30)}, 'Token is expired', 401],
				['Expired Token', {token:$scope.makeRandomInvalidToken(30)}, 'Token is expired', 401]
			]
		},
		{
			category:"Login when user isnt present",
			sequence:"login",
			tests:[
				['No Data', {}, 'Missing token: username', 401],
				['No Data', {username:''}, 'Missing token: username', 401],
				['Username', {username:"stuff"}, 'Missing token: password', 401],
				['Username missing with password', {firstName:"cam", lastName:"McCord", password:"password", email:"cameronmccord2@gmail.com", username:$scope.makeRandomString(0)}, 'Missing token: username', 401],
				['Garbage Username with password, short', {firstName:"cam", lastName:"McCord", password:"password", email:"cameronmccord2@gmail.com", username:$scope.makeRandomString(1)}, 'Username too short, should be more than 5', 400],
				['Garbage Username with password, short', {firstName:"cam", lastName:"McCord", password:"password", email:"cameronmccord2@gmail.com", username:$scope.makeRandomString(2)}, 'Username too short, should be more than 5', 400],
				['Garbage Username with password, short', {firstName:"cam", lastName:"McCord", password:"password", email:"cameronmccord2@gmail.com", username:$scope.makeRandomString(3)}, 'Username too short, should be more than 5', 400],
				['Garbage Username with password, short', {firstName:"cam", lastName:"McCord", password:"password", email:"cameronmccord2@gmail.com", username:$scope.makeRandomString(4)}, 'Username too short, should be more than 5', 400],
				['Garbage Username with password', {firstName:"cam", lastName:"McCord", password:"password", email:"cameronmccord2@gmail.com", username:$scope.makeRandomString(5)}, 'usernameInvalid', 400],
				['Garbage Username with password, start with number', {firstName:"cam", lastName:"McCord", password:"password", email:"cameronmccord2@gmail.com", username:'1' + $scope.makeRandomString(5)}, 'Username cant start with a number', 400],
				['Garbage Username with password', {firstName:"cam", lastName:"McCord", password:"password", email:"cameronmccord2@gmail.com", username:$scope.makeRandomString(6)}, 'usernameInvalid', 400],
				['Garbage Username with password, start with number', {firstName:"cam", lastName:"McCord", password:"password", email:"cameronmccord2@gmail.com", username:'1' + $scope.makeRandomString(6)}, 'Username cant start with a number', 400],
				['Garbage Username with password', {firstName:"cam", lastName:"McCord", password:"password", email:"cameronmccord2@gmail.com", username:$scope.makeRandomString(7)}, 'usernameInvalid', 400],
				['Garbage Username with password, start with number', {firstName:"cam", lastName:"McCord", password:"password", email:"cameronmccord2@gmail.com", username:'1' + $scope.makeRandomString(7)}, 'Username cant start with a number', 400],
				['Garbage Username with password', {firstName:"cam", lastName:"McCord", password:"password", email:"cameronmccord2@gmail.com", username:$scope.makeRandomString(8)}, 'usernameInvalid', 400],
				['Garbage Username with password, start with number', {firstName:"cam", lastName:"McCord", password:"password", email:"cameronmccord2@gmail.com", username:'1' + $scope.makeRandomString(8)}, 'Username cant start with a number', 400],
				['Garbage Username with password', {firstName:"cam", lastName:"McCord", password:"password", email:"cameronmccord2@gmail.com", username:$scope.makeRandomString(9)}, 'usernameInvalid', 400],
				['Garbage Username with password, start with number', {firstName:"cam", lastName:"McCord", password:"password", email:"cameronmccord2@gmail.com", username:'1' + $scope.makeRandomString(9)}, 'Username cant start with a number', 400],
				['Garbage Username with password', {firstName:"cam", lastName:"McCord", password:"password", email:"cameronmccord2@gmail.com", username:$scope.makeRandomString(10)}, 'usernameInvalid', 400],
				['Garbage Username with password, start with number', {firstName:"cam", lastName:"McCord", password:"password", email:"cameronmccord2@gmail.com", username:'1' + $scope.makeRandomString(10)}, 'Username cant start with a number', 400],
				['Garbage Username with password', {firstName:"cam", lastName:"McCord", password:"password", email:"cameronmccord2@gmail.com", username:$scope.makeRandomString(11)}, 'usernameInvalid', 400],
				['Garbage Username with password, start with number', {firstName:"cam", lastName:"McCord", password:"password", email:"cameronmccord2@gmail.com", username:'1' + $scope.makeRandomString(11)}, 'Username cant start with a number', 400],
				['Garbage Username with password', {firstName:"cam", lastName:"McCord", password:"password", email:"cameronmccord2@gmail.com", username:$scope.makeRandomString(12)}, 'usernameInvalid', 400],
				['Garbage Username with password, start with number', {firstName:"cam", lastName:"McCord", password:"password", email:"cameronmccord2@gmail.com", username:'1' + $scope.makeRandomString(12)}, 'Username cant start with a number', 400],
				['Garbage Username with password', {firstName:"cam", lastName:"McCord", password:"password", email:"cameronmccord2@gmail.com", username:$scope.makeRandomString(13)}, 'usernameInvalid', 400],
				['Garbage Username with password, start with number', {firstName:"cam", lastName:"McCord", password:"password", email:"cameronmccord2@gmail.com", username:'1' + $scope.makeRandomString(13)}, 'Username cant start with a number', 400],
				['Garbage Username with password', {firstName:"cam", lastName:"McCord", password:"password", email:"cameronmccord2@gmail.com", username:$scope.makeRandomString(14)}, 'usernameInvalid', 400],
				['Garbage Username with password, start with number', {firstName:"cam", lastName:"McCord", password:"password", email:"cameronmccord2@gmail.com", username:'1' + $scope.makeRandomString(14)}, 'Username cant start with a number', 400],
				['Garbage Username with password', {firstName:"cam", lastName:"McCord", password:"password", email:"cameronmccord2@gmail.com", username:$scope.makeRandomString(15)}, 'usernameInvalid', 400],
				['Garbage Username with password, start with number', {firstName:"cam", lastName:"McCord", password:"password", email:"cameronmccord2@gmail.com", username:'1' + $scope.makeRandomString(15)}, 'Username cant start with a number', 400],
				['Garbage Username with password', {firstName:"cam", lastName:"McCord", password:"password", email:"cameronmccord2@gmail.com", username:$scope.makeRandomString(16)}, 'usernameInvalid', 400],
				['Garbage Username with password, start with number', {firstName:"cam", lastName:"McCord", password:"password", email:"cameronmccord2@gmail.com", username:'1' + $scope.makeRandomString(16)}, 'Username cant start with a number', 400],
				['Garbage Username with password', {firstName:"cam", lastName:"McCord", password:"password", email:"cameronmccord2@gmail.com", username:$scope.makeRandomString(17)}, 'usernameInvalid', 400],
				['Garbage Username with password, start with number', {firstName:"cam", lastName:"McCord", password:"password", email:"cameronmccord2@gmail.com", username:'1' + $scope.makeRandomString(17)}, 'Username cant start with a number', 400],
				['Garbage Username with password', {firstName:"cam", lastName:"McCord", password:"password", email:"cameronmccord2@gmail.com", username:$scope.makeRandomString(18)}, 'usernameInvalid', 400],
				['Garbage Username with password, start with number', {firstName:"cam", lastName:"McCord", password:"password", email:"cameronmccord2@gmail.com", username:'1' + $scope.makeRandomString(18)}, 'Username cant start with a number', 400],
				['Garbage Username with password', {firstName:"cam", lastName:"McCord", password:"password", email:"cameronmccord2@gmail.com", username:$scope.makeRandomString(19)}, 'usernameInvalid', 400],
				['Garbage Username with password, start with number', {firstName:"cam", lastName:"McCord", password:"password", email:"cameronmccord2@gmail.com", username:'1' + $scope.makeRandomString(19)}, 'Username too long, should be less than 20', 400],
				['Garbage Username with password, too long', {firstName:"cam", lastName:"McCord", password:"password", email:"cameronmccord2@gmail.com", username:$scope.makeRandomString(20)}, 'Username too long, should be less than 20', 400],
				['Garbage Username with password, start with number, too long', {firstName:"cam", lastName:"McCord", password:"password", email:"cameronmccord2@gmail.com", username:'1' + $scope.makeRandomString(20)}, 'Username too long, should be less than 20', 400],
				['Garbage Username with password, too long', {firstName:"cam", lastName:"McCord", password:"password", email:"cameronmccord2@gmail.com", username:$scope.makeRandomString(21)}, 'Username too long, should be less than 20', 400],
				['Garbage Username with password, start with number, too long', {firstName:"cam", lastName:"McCord", password:"password", email:"cameronmccord2@gmail.com", username:'1' + $scope.makeRandomString(21)}, 'Username too long, should be less than 20', 400],
				['Garbage Username with password, too long', {firstName:"cam", lastName:"McCord", password:"password", email:"cameronmccord2@gmail.com", username:$scope.makeRandomString(22)}, 'Username too long, should be less than 20', 400],
				['Garbage Username with password, start with number, too long', {firstName:"cam", lastName:"McCord", password:"password", email:"cameronmccord2@gmail.com", username:'1' + $scope.makeRandomString(22)}, 'Username too long, should be less than 20', 400],
				['Garbage Username with password, too long', {firstName:"cam", lastName:"McCord", password:"password", email:"cameronmccord2@gmail.com", username:$scope.makeRandomString(23)}, 'Username too long, should be less than 20', 400],
				['Garbage Username with password, start with number, too long', {firstName:"cam", lastName:"McCord", password:"password", email:"cameronmccord2@gmail.com", username:'1' + $scope.makeRandomString(23)}, 'Username too long, should be less than 20', 400],
				['Garbage Username with password, too long', {firstName:"cam", lastName:"McCord", password:"password", email:"cameronmccord2@gmail.com", username:$scope.makeRandomString(24)}, 'Username too long, should be less than 20', 400],
				['Garbage Username with password, start with number, too long', {firstName:"cam", lastName:"McCord", password:"password", email:"cameronmccord2@gmail.com", username:'1' + $scope.makeRandomString(24)}, 'Username too long, should be less than 20', 400],
				['Garbage Username with password, too long', {firstName:"cam", lastName:"McCord", password:"password", email:"cameronmccord2@gmail.com", username:$scope.makeRandomString(25)}, 'Username too long, should be less than 20', 400],
				['Garbage Username with password, start with number, too long', {firstName:"cam", lastName:"McCord", password:"password", email:"cameronmccord2@gmail.com", username:'1' + $scope.makeRandomString(25)}, 'Username too long, should be less than 20', 400],
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
				['Existing User', {firstName:"cam", lastName:"McCord", username:"username", password:"password", email:"cameronmccord2@gmail.com"}, "Username already exists", 401],
				//{firstName:"cam", lastName:"McCord", password:"password", email:"cameronmccord2@gmail.com", username:'1' + $scope.makeRandomString(


				['Username missing with password', {firstName:"cam", lastName:"McCord", password:"password", email:"cameronmccord2@gmail.com", username:$scope.makeRandomString(0)}, 'Missing token: username', 401],
				['Garbage Username with password, short', {firstName:"cam", lastName:"McCord", password:"password", email:"cameronmccord2@gmail.com", username:$scope.makeRandomString(1)}, 'Username too short, should be more than 5', 400],
				['Garbage Username with password, short', {firstName:"cam", lastName:"McCord", password:"password", email:"cameronmccord2@gmail.com", username:$scope.makeRandomString(2)}, 'Username too short, should be more than 5', 400],
				['Garbage Username with password, short', {firstName:"cam", lastName:"McCord", password:"password", email:"cameronmccord2@gmail.com", username:$scope.makeRandomString(3)}, 'Username too short, should be more than 5', 400],
				['Garbage Username with password, short', {firstName:"cam", lastName:"McCord", password:"password", email:"cameronmccord2@gmail.com", username:$scope.makeRandomString(4)}, 'Username too short, should be more than 5', 400],
				['Garbage Username with password', {firstName:"cam", lastName:"McCord", password:"password", email:"cameronmccord2@gmail.com", username:$scope.makeRandomString(5)}, undefined, 200],
				['Garbage Username with password, start with number', {firstName:"cam", lastName:"McCord", password:"password", email:"cameronmccord2@gmail.com", username:'1' + $scope.makeRandomString(5)}, 'Username cant start with a number', 400],
				['Garbage Username with password', {firstName:"cam", lastName:"McCord", password:"password", email:"cameronmccord2@gmail.com", username:$scope.makeRandomString(6)}, undefined, 200],
				['Garbage Username with password, start with number', {firstName:"cam", lastName:"McCord", password:"password", email:"cameronmccord2@gmail.com", username:'1' + $scope.makeRandomString(6)}, 'Username cant start with a number', 400],
				['Garbage Username with password', {firstName:"cam", lastName:"McCord", password:"password", email:"cameronmccord2@gmail.com", username:$scope.makeRandomString(7)}, undefined, 200],
				['Garbage Username with password, start with number', {firstName:"cam", lastName:"McCord", password:"password", email:"cameronmccord2@gmail.com", username:'1' + $scope.makeRandomString(7)}, 'Username cant start with a number', 400],
				['Garbage Username with password', {firstName:"cam", lastName:"McCord", password:"password", email:"cameronmccord2@gmail.com", username:$scope.makeRandomString(8)}, undefined, 200],
				['Garbage Username with password, start with number', {firstName:"cam", lastName:"McCord", password:"password", email:"cameronmccord2@gmail.com", username:'1' + $scope.makeRandomString(8)}, 'Username cant start with a number', 400],
				['Garbage Username with password', {firstName:"cam", lastName:"McCord", password:"password", email:"cameronmccord2@gmail.com", username:$scope.makeRandomString(9)}, undefined, 200],
				['Garbage Username with password, start with number', {firstName:"cam", lastName:"McCord", password:"password", email:"cameronmccord2@gmail.com", username:'1' + $scope.makeRandomString(9)}, 'Username cant start with a number', 400],
				['Garbage Username with password', {firstName:"cam", lastName:"McCord", password:"password", email:"cameronmccord2@gmail.com", username:$scope.makeRandomString(10)}, undefined, 200],
				['Garbage Username with password, start with number', {firstName:"cam", lastName:"McCord", password:"password", email:"cameronmccord2@gmail.com", username:'1' + $scope.makeRandomString(10)}, 'Username cant start with a number', 400],
				['Garbage Username with password', {firstName:"cam", lastName:"McCord", password:"password", email:"cameronmccord2@gmail.com", username:$scope.makeRandomString(11)}, undefined, 200],
				['Garbage Username with password, start with number', {firstName:"cam", lastName:"McCord", password:"password", email:"cameronmccord2@gmail.com", username:'1' + $scope.makeRandomString(11)}, 'Username cant start with a number', 400],
				['Garbage Username with password', {firstName:"cam", lastName:"McCord", password:"password", email:"cameronmccord2@gmail.com", username:$scope.makeRandomString(12)}, undefined, 200],
				['Garbage Username with password, start with number', {firstName:"cam", lastName:"McCord", password:"password", email:"cameronmccord2@gmail.com", username:'1' + $scope.makeRandomString(12)}, 'Username cant start with a number', 400],
				['Garbage Username with password', {firstName:"cam", lastName:"McCord", password:"password", email:"cameronmccord2@gmail.com", username:$scope.makeRandomString(13)}, undefined, 200],
				['Garbage Username with password, start with number', {firstName:"cam", lastName:"McCord", password:"password", email:"cameronmccord2@gmail.com", username:'1' + $scope.makeRandomString(13)}, 'Username cant start with a number', 400],
				['Garbage Username with password', {firstName:"cam", lastName:"McCord", password:"password", email:"cameronmccord2@gmail.com", username:$scope.makeRandomString(14)}, undefined, 200],
				['Garbage Username with password, start with number', {firstName:"cam", lastName:"McCord", password:"password", email:"cameronmccord2@gmail.com", username:'1' + $scope.makeRandomString(14)}, 'Username cant start with a number', 400],
				['Garbage Username with password', {firstName:"cam", lastName:"McCord", password:"password", email:"cameronmccord2@gmail.com", username:$scope.makeRandomString(15)}, undefined, 200],
				['Garbage Username with password, start with number', {firstName:"cam", lastName:"McCord", password:"password", email:"cameronmccord2@gmail.com", username:'1' + $scope.makeRandomString(15)}, 'Username cant start with a number', 400],
				['Garbage Username with password', {firstName:"cam", lastName:"McCord", password:"password", email:"cameronmccord2@gmail.com", username:$scope.makeRandomString(16)}, undefined, 200],
				['Garbage Username with password, start with number', {firstName:"cam", lastName:"McCord", password:"password", email:"cameronmccord2@gmail.com", username:'1' + $scope.makeRandomString(16)}, 'Username cant start with a number', 400],
				['Garbage Username with password', {firstName:"cam", lastName:"McCord", password:"password", email:"cameronmccord2@gmail.com", username:$scope.makeRandomString(17)}, undefined, 200],
				['Garbage Username with password, start with number', {firstName:"cam", lastName:"McCord", password:"password", email:"cameronmccord2@gmail.com", username:'1' + $scope.makeRandomString(17)}, 'Username cant start with a number', 400],
				['Garbage Username with password', {firstName:"cam", lastName:"McCord", password:"password", email:"cameronmccord2@gmail.com", username:$scope.makeRandomString(18)}, undefined, 200],
				['Garbage Username with password, start with number', {firstName:"cam", lastName:"McCord", password:"password", email:"cameronmccord2@gmail.com", username:'1' + $scope.makeRandomString(18)}, 'Username cant start with a number', 400],
				['Garbage Username with password', {firstName:"cam", lastName:"McCord", password:"password", email:"cameronmccord2@gmail.com", username:$scope.makeRandomString(19)}, undefined, 200],
				['Garbage Username with password, start with number', {firstName:"cam", lastName:"McCord", password:"password", email:"cameronmccord2@gmail.com", username:'1' + $scope.makeRandomString(19)}, 'Username too long, should be less than 20', 400],
				['Garbage Username with password, too long', {firstName:"cam", lastName:"McCord", password:"password", email:"cameronmccord2@gmail.com", username:$scope.makeRandomString(20)}, 'Username too long, should be less than 20', 400],
				['Garbage Username with password, start with number, too long', {firstName:"cam", lastName:"McCord", password:"password", email:"cameronmccord2@gmail.com", username:'1' + $scope.makeRandomString(20)}, 'Username too long, should be less than 20', 400],
				['Garbage Username with password, too long', {firstName:"cam", lastName:"McCord", password:"password", email:"cameronmccord2@gmail.com", username:$scope.makeRandomString(21)}, 'Username too long, should be less than 20', 400],
				['Garbage Username with password, start with number, too long', {firstName:"cam", lastName:"McCord", password:"password", email:"cameronmccord2@gmail.com", username:'1' + $scope.makeRandomString(21)}, 'Username too long, should be less than 20', 400],
				['Garbage Username with password, too long', {firstName:"cam", lastName:"McCord", password:"password", email:"cameronmccord2@gmail.com", username:$scope.makeRandomString(22)}, 'Username too long, should be less than 20', 400],
				['Garbage Username with password, start with number, too long', {firstName:"cam", lastName:"McCord", password:"password", email:"cameronmccord2@gmail.com", username:'1' + $scope.makeRandomString(22)}, 'Username too long, should be less than 20', 400],
				['Garbage Username with password, too long', {firstName:"cam", lastName:"McCord", password:"password", email:"cameronmccord2@gmail.com", username:$scope.makeRandomString(23)}, 'Username too long, should be less than 20', 400],
				['Garbage Username with password, start with number, too long', {firstName:"cam", lastName:"McCord", password:"password", email:"cameronmccord2@gmail.com", username:'1' + $scope.makeRandomString(23)}, 'Username too long, should be less than 20', 400],
				['Garbage Username with password, too long', {firstName:"cam", lastName:"McCord", password:"password", email:"cameronmccord2@gmail.com", username:$scope.makeRandomString(24)}, 'Username too long, should be less than 20', 400],
				['Garbage Username with password, start with number, too long', {firstName:"cam", lastName:"McCord", password:"password", email:"cameronmccord2@gmail.com", username:'1' + $scope.makeRandomString(24)}, 'Username too long, should be less than 20', 400],
				['Garbage Username with password, too long', {firstName:"cam", lastName:"McCord", password:"password", email:"cameronmccord2@gmail.com", username:$scope.makeRandomString(25)}, 'Username too long, should be less than 20', 400],
				['Garbage Username with password, start with number, too long', {firstName:"cam", lastName:"McCord", password:"password", email:"cameronmccord2@gmail.com", username:'1' + $scope.makeRandomString(25)}, 'Username too long, should be less than 20', 400],
			]
		},
		{
			category:"Logout, not logged in",
			sequence:"logout",
			tests:[
				['No Data', {}, 'Missing authorization token', 401],
				['Token that isnt in tokens', {token:$scope.makeRandomValidToken(30)}, 'Token does not exist', 401]
			]
		},
		{
			category:"Invalid Login",
			sequence:"login",
			tests:[
				['No Data', {}, 'Missing token: username', 401],
				['Username', {username:"stuff"}, 'Missing token: password', 401],

				['Username missing with password', {firstName:"cam", lastName:"McCord", password:"password", email:"cameronmccord2@gmail.com", username:$scope.makeRandomString(0)}, 'Missing token: username', 401],
				['Garbage Username with password, short', {firstName:"cam", lastName:"McCord", password:"password", email:"cameronmccord2@gmail.com", username:$scope.makeRandomString(1)}, 'Username too short, should be more than 5', 400],
				['Garbage Username with password, short', {firstName:"cam", lastName:"McCord", password:"password", email:"cameronmccord2@gmail.com", username:$scope.makeRandomString(2)}, 'Username too short, should be more than 5', 400],
				['Garbage Username with password, short', {firstName:"cam", lastName:"McCord", password:"password", email:"cameronmccord2@gmail.com", username:$scope.makeRandomString(3)}, 'Username too short, should be more than 5', 400],
				['Garbage Username with password, short', {firstName:"cam", lastName:"McCord", password:"password", email:"cameronmccord2@gmail.com", username:$scope.makeRandomString(4)}, 'Username too short, should be more than 5', 400],
				['Garbage Username with password', {firstName:"cam", lastName:"McCord", password:"password", email:"cameronmccord2@gmail.com", username:$scope.makeRandomString(5)}, 'usernameInvalid', 400],
				['Garbage Username with password, start with number', {firstName:"cam", lastName:"McCord", password:"password", email:"cameronmccord2@gmail.com", username:'1' + $scope.makeRandomString(5)}, 'Username cant start with a number', 400],
				['Garbage Username with password', {firstName:"cam", lastName:"McCord", password:"password", email:"cameronmccord2@gmail.com", username:$scope.makeRandomString(6)}, 'usernameInvalid', 400],
				['Garbage Username with password, start with number', {firstName:"cam", lastName:"McCord", password:"password", email:"cameronmccord2@gmail.com", username:'1' + $scope.makeRandomString(6)}, 'Username cant start with a number', 400],
				['Garbage Username with password', {firstName:"cam", lastName:"McCord", password:"password", email:"cameronmccord2@gmail.com", username:$scope.makeRandomString(7)}, 'usernameInvalid', 400],
				['Garbage Username with password, start with number', {firstName:"cam", lastName:"McCord", password:"password", email:"cameronmccord2@gmail.com", username:'1' + $scope.makeRandomString(7)}, 'Username cant start with a number', 400],
				['Garbage Username with password', {firstName:"cam", lastName:"McCord", password:"password", email:"cameronmccord2@gmail.com", username:$scope.makeRandomString(8)}, 'usernameInvalid', 400],
				['Garbage Username with password, start with number', {firstName:"cam", lastName:"McCord", password:"password", email:"cameronmccord2@gmail.com", username:'1' + $scope.makeRandomString(8)}, 'Username cant start with a number', 400],
				['Garbage Username with password', {firstName:"cam", lastName:"McCord", password:"password", email:"cameronmccord2@gmail.com", username:$scope.makeRandomString(9)}, 'usernameInvalid', 400],
				['Garbage Username with password, start with number', {firstName:"cam", lastName:"McCord", password:"password", email:"cameronmccord2@gmail.com", username:'1' + $scope.makeRandomString(9)}, 'Username cant start with a number', 400],
				['Garbage Username with password', {firstName:"cam", lastName:"McCord", password:"password", email:"cameronmccord2@gmail.com", username:$scope.makeRandomString(10)}, 'usernameInvalid', 400],
				['Garbage Username with password, start with number', {firstName:"cam", lastName:"McCord", password:"password", email:"cameronmccord2@gmail.com", username:'1' + $scope.makeRandomString(10)}, 'Username cant start with a number', 400],
				['Garbage Username with password', {firstName:"cam", lastName:"McCord", password:"password", email:"cameronmccord2@gmail.com", username:$scope.makeRandomString(11)}, 'usernameInvalid', 400],
				['Garbage Username with password, start with number', {firstName:"cam", lastName:"McCord", password:"password", email:"cameronmccord2@gmail.com", username:'1' + $scope.makeRandomString(11)}, 'Username cant start with a number', 400],
				['Garbage Username with password', {firstName:"cam", lastName:"McCord", password:"password", email:"cameronmccord2@gmail.com", username:$scope.makeRandomString(12)}, 'usernameInvalid', 400],
				['Garbage Username with password, start with number', {firstName:"cam", lastName:"McCord", password:"password", email:"cameronmccord2@gmail.com", username:'1' + $scope.makeRandomString(12)}, 'Username cant start with a number', 400],
				['Garbage Username with password', {firstName:"cam", lastName:"McCord", password:"password", email:"cameronmccord2@gmail.com", username:$scope.makeRandomString(13)}, 'usernameInvalid', 400],
				['Garbage Username with password, start with number', {firstName:"cam", lastName:"McCord", password:"password", email:"cameronmccord2@gmail.com", username:'1' + $scope.makeRandomString(13)}, 'Username cant start with a number', 400],
				['Garbage Username with password', {firstName:"cam", lastName:"McCord", password:"password", email:"cameronmccord2@gmail.com", username:$scope.makeRandomString(14)}, 'usernameInvalid', 400],
				['Garbage Username with password, start with number', {firstName:"cam", lastName:"McCord", password:"password", email:"cameronmccord2@gmail.com", username:'1' + $scope.makeRandomString(14)}, 'Username cant start with a number', 400],
				['Garbage Username with password', {firstName:"cam", lastName:"McCord", password:"password", email:"cameronmccord2@gmail.com", username:$scope.makeRandomString(15)}, 'usernameInvalid', 400],
				['Garbage Username with password, start with number', {firstName:"cam", lastName:"McCord", password:"password", email:"cameronmccord2@gmail.com", username:'1' + $scope.makeRandomString(15)}, 'Username cant start with a number', 400],
				['Garbage Username with password', {firstName:"cam", lastName:"McCord", password:"password", email:"cameronmccord2@gmail.com", username:$scope.makeRandomString(16)}, 'usernameInvalid', 400],
				['Garbage Username with password, start with number', {firstName:"cam", lastName:"McCord", password:"password", email:"cameronmccord2@gmail.com", username:'1' + $scope.makeRandomString(16)}, 'Username cant start with a number', 400],
				['Garbage Username with password', {firstName:"cam", lastName:"McCord", password:"password", email:"cameronmccord2@gmail.com", username:$scope.makeRandomString(17)}, 'usernameInvalid', 400],
				['Garbage Username with password, start with number', {firstName:"cam", lastName:"McCord", password:"password", email:"cameronmccord2@gmail.com", username:'1' + $scope.makeRandomString(17)}, 'Username cant start with a number', 400],
				['Garbage Username with password', {firstName:"cam", lastName:"McCord", password:"password", email:"cameronmccord2@gmail.com", username:$scope.makeRandomString(18)}, 'usernameInvalid', 400],
				['Garbage Username with password, start with number', {firstName:"cam", lastName:"McCord", password:"password", email:"cameronmccord2@gmail.com", username:'1' + $scope.makeRandomString(18)}, 'Username cant start with a number', 400],
				['Garbage Username with password', {firstName:"cam", lastName:"McCord", password:"password", email:"cameronmccord2@gmail.com", username:$scope.makeRandomString(19)}, 'usernameInvalid', 400],
				['Garbage Username with password, start with number', {firstName:"cam", lastName:"McCord", password:"password", email:"cameronmccord2@gmail.com", username:'1' + $scope.makeRandomString(19)}, 'Username too long, should be less than 20', 400],
				['Garbage Username with password, too long', {firstName:"cam", lastName:"McCord", password:"password", email:"cameronmccord2@gmail.com", username:$scope.makeRandomString(20)}, 'Username too long, should be less than 20', 400],
				['Garbage Username with password, start with number, too long', {firstName:"cam", lastName:"McCord", password:"password", email:"cameronmccord2@gmail.com", username:'1' + $scope.makeRandomString(20)}, 'Username too long, should be less than 20', 400],
				['Garbage Username with password, too long', {firstName:"cam", lastName:"McCord", password:"password", email:"cameronmccord2@gmail.com", username:$scope.makeRandomString(21)}, 'Username too long, should be less than 20', 400],
				['Garbage Username with password, start with number, too long', {firstName:"cam", lastName:"McCord", password:"password", email:"cameronmccord2@gmail.com", username:'1' + $scope.makeRandomString(21)}, 'Username too long, should be less than 20', 400],
				['Garbage Username with password, too long', {firstName:"cam", lastName:"McCord", password:"password", email:"cameronmccord2@gmail.com", username:$scope.makeRandomString(22)}, 'Username too long, should be less than 20', 400],
				['Garbage Username with password, start with number, too long', {firstName:"cam", lastName:"McCord", password:"password", email:"cameronmccord2@gmail.com", username:'1' + $scope.makeRandomString(22)}, 'Username too long, should be less than 20', 400],
				['Garbage Username with password, too long', {firstName:"cam", lastName:"McCord", password:"password", email:"cameronmccord2@gmail.com", username:$scope.makeRandomString(23)}, 'Username too long, should be less than 20', 400],
				['Garbage Username with password, start with number, too long', {firstName:"cam", lastName:"McCord", password:"password", email:"cameronmccord2@gmail.com", username:'1' + $scope.makeRandomString(23)}, 'Username too long, should be less than 20', 400],
				['Garbage Username with password, too long', {firstName:"cam", lastName:"McCord", password:"password", email:"cameronmccord2@gmail.com", username:$scope.makeRandomString(24)}, 'Username too long, should be less than 20', 400],
				['Garbage Username with password, start with number, too long', {firstName:"cam", lastName:"McCord", password:"password", email:"cameronmccord2@gmail.com", username:'1' + $scope.makeRandomString(24)}, 'Username too long, should be less than 20', 400],
				['Garbage Username with password, too long', {firstName:"cam", lastName:"McCord", password:"password", email:"cameronmccord2@gmail.com", username:$scope.makeRandomString(25)}, 'Username too long, should be less than 20', 400],
				['Garbage Username with password, start with number, too long', {firstName:"cam", lastName:"McCord", password:"password", email:"cameronmccord2@gmail.com", username:'1' + $scope.makeRandomString(25)}, 'Username too long, should be less than 20', 400]
			]
		},
		{
			category:"Good login",
			sequence:'login',
			tests:[
				['Good Login', {username:"username", password:"password"}, undefined, 200]
			]
		},
		{
			category:"User Data",
			sequence:"userData",
			tests:[
				['No Data', {}, undefined, 200]// token added to all outbound calls
			]
		},
		{
			category:"Early Logout",
			sequence:'logout',
			tests:[
				['No Data', {}, 'logged out', 200]
			]
		},
		{
			category:"Relogin",
			sequence:'login',
			tests:[
				['Good Login', {username:"username", password:"password"}, undefined, 200]
			]
		},
		{
			category:"New Item",
			sequence:'newItem',
			tests:[
				['No Data', {}, 'Missing token: attributes', 400],
				['No Location Code', {attributes:new Array()}, 'Missing token: locationCode', 400],
				['No longitude', {attributes:new Array(), locationCode:'1234'}, 'Missing token: longitude', 400],
				['No latitude', {attributes:new Array(), locationCode:'1234', longitude:100}, 'Missing token: latitude', 400],
				['Good item', {attributes:new Array(), locationCode:'1234', longitude:100, latitude:100}, undefined, 400],

			]
		}
	];

	$scope.makeDbName();
	if($routeParams.from != undefined && $routeParams.to == undefined){
		$scope.runTests(parseInt($routeParams.from), $scope.tests.length - 1);
		$scope.newTest = {from:parseInt($routeParams.from), to:$scope.tests.length - 1};
	}else if($routeParams.from != undefined && $routeParams.to != undefined){
		$scope.newTest = {from:parseInt($routeParams.from), to:parseInt($routeParams.to)};
		$scope.runTests(parseInt($routeParams.from), parseInt($routeParams.to));
	}else
		$scope.newTest = {from:0, to:$scope.tests.length - 1};
	// add more with .then(function(){$scope.testLoop(4);})
	//$scope.testLoop(0).then(function(){$scope.testLoop(1).then(function(){$scope.testLoop(2).then(function(){$scope.testLoop(3).then(function(){$scope.testLoop(4).then(function(){$scope.testLoop(5);});});});});});
	//$scope.testLoop(1).then(function(){$scope.testLoop(2)});
	// $scope.testLoop(2);
}

















































