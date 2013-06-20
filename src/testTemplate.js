function testTemplate($scope, $routeParams, $rootScope, $http, $location, $q){

    $scope.results = new Array();
    $scope.tests = new Array();
    $scope.resultStatus = {
        success:"Success",
        failure:"Failure",
        hardError:"HardError",
        loading:"Loading",
        statusError:"StatusError"
    };
    $scope.tests.push({method:'GET', sequence:'', path:'', inputBody:'', inputConfig:{params:{something:''}}, correctOutput:'', correctResultStatus:'', result:'', resultStatus:'', time:'', showExpandable:false});
    $scope.tests.push({method:'GET', sequence:'', path:'', inputBody:'', inputConfig:{params:{something:''}}, correctOutput:'', correctResultStatus:'', result:'', resultStatus:'', time:'', showExpandable:false});

    $scope.toggleExpandRow = function(index){
        if($scope.tests[index].showExpandable == true)
            $scope.tests[index].showExpandable = false;
        else
            $scope.tests[index].showExpandable = true;
    }

    $scope.generateResult = function(data, status, headers, config){
        return {
            data:data,
            status:status,
            headers:headers,
            config:config
        };
    }

    $scope.setResultInfo = function(test, resultStatus, result, duration){
        test.resultStatus = resultStatus;
        test.result = result;
        test.time = duration;
        return test;
    }

    $scope.evaluateResult = function(test, data, status, headers, config, duration){
        duratdion = (new Date()).getTime() - duration;
        var result = generateResult(data, status, headers, config);
        if(correctResultStatus == status){
            if(data == test.correctOutput){
                test = setResultInfo(test, $scope.resultStatus.success, result, duration);
            }else{
                test = setResultInfo(test, $scope.resultStatus.failure, result, duration);
            }
        }else{
            test = setResultInfo(test, $scope.resultStatus.statusError, result, duration);
        }
        return test;
    }

    for(test in $scope.tests){
        test.resultStatus = $scope.resultStatus.loading;
        var duration = (new Date()).getTime();
        if(test.method == 'GET'){
            $http.get($scope.baseUrl + test.path, test.inputConfig).success(function(data, status, headers, config){
                test = $scope.evaluateResult(test, data, status, headers, config, duration);
            }).error(function(data, status, headers, config){
                test = $scope.evaluateResult(test, data, status, headers, config, duration);
            });
        }else if(test.method == 'PUT'){
            $http.put($scope.baseUrl + test.path, test.inputBody, test.inputConfig).success(function(data, status, headers, config){
                test = $scope.evaluateResult(test, data, status, headers, config, duration);
            }).error(function(data, status, headers, config){
                test = $scope.evaluateResult(test, data, status, headers, config, duration);
            });
        }else if(test.method == 'POST'){
            $http.post($scope.baseUrl + test.path, test.inputBody, test.inputConfig).success(function(data, status, headers, config){
                test = $scope.evaluateResult(test, data, status, headers, config, duration);
            }).error(function(data, status, headers, config){
                test = $scope.evaluateResult(test, data, status, headers, config, duration);
            });
        }else if(test.method == 'DELETE'){
            $http.delete($scope.baseUrl + test.path, test.inputConfig).success(function(data, status, headers, config){
                test = $scope.evaluateResult(test, data, status, headers, config, duration);
            }).error(function(data, status, headers, config){
                test = $scope.evaluateResult(test, data, status, headers, config, duration);
            });
        }else if(test.method == 'JSONP'){
            $http.jsonp($scope.baseUrl + test.path, test.inputConfig).success(function(data, status, headers, config){
                test = $scope.evaluateResult(test, data, status, headers, config, duration);
            }).error(function(data, status, headers, config){
                test = $scope.evaluateResult(test, data, status, headers, config, duration);
            });
        }else if(test.method == 'HEAD'){
            $http.head($scope.baseUrl + test.path, test.inputConfig).success(function(data, status, headers, config){
                test = $scope.evaluateResult(test, data, status, headers, config, duration);
            }).error(function(data, status, headers, config){
                test = $scope.evaluateResult(test, data, status, headers, config, duration);
            });
        }else{
            alert('invalid method: ' + test.method);
        }
    };
}