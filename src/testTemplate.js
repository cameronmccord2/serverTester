function mainCtrl($scope, $routeParams, $rootScope, $http, $location, $q)
{
    $scope.results = new Array();
    $scope.tests = new Array();
    $scope.test = {
        method:'',
        input:'',
        output:'',
        path:''
    };
    $scope.tests.push({method:'GET', path:'', inputBody:'', inputConfig:{params:{something:''}}, output:'', resultStatus:''});
    $scope.tests.push({method:'GET', path:'', inputBody:'', inputConfig:{params:{something:''}}, output:'', resultStatus:''});

    for(test in $scope.tests){
        var duration = (new Date()).getTime();
        if(test.method == 'GET'){
            $http.get($scope.baseUrl + test.path, test.inputConfig).success(function(data, status, headers, config){
                duration = (new Date()).getTime() - duration;
                var result = {
                    data:data,
                    status:status,
                    headers:headers,
                    config:config
                };
                if(data == test.output){
                    $scope.results.push({test:test, status:'Success', result:result, time:duration});
                }else{
                    $scope.results.push({test:test, status:'Failure', result:result, time:duration});
                }
            }).error(function(data, status, headers, config){
                duration = (new Date()).getTime() - duration;
                var result = {
                    data:data,
                    status:status,
                    headers:headers,
                    config:config
                };
                if(resultStatus == status){
                    if(data == test.output){
                        $scope.results.push({test:test, status:'Success', result:result, time:duration});
                    }else{
                        $scope.results.push({test:test, status:'Failure', result:result, time:duration});   
                    }
                }else{
                    $scope.results.push({test:test, status:'Hard Failure', result:result, time:duration});
                }
            });
        }else if(test.method == 'PUT'){
            $http.put($scope.baseUrl + test.path, test.inputBody, test.inputConfig).success(function(data, status, headers, config){
                duration = (new Date()).getTime() - duration;
                var result = {
                    data:data,
                    status:status,
                    headers:headers,
                    config:config
                };
                if(data == test.output){
                    $scope.results.push({test:test, status:'Success', result:result, time:duration});
                }else{
                    $scope.results.push({test:test, status:'Failure', result:result, time:duration});
                }
            }).error(function(data, status, headers, config){
                duration = (new Date()).getTime() - duration;
                var result = {
                    data:data,
                    status:status,
                    headers:headers,
                    config:config
                };
                if(resultStatus == status){
                    if(data == test.output){
                        $scope.results.push({test:test, status:'Success', result:result, time:duration});
                    }else{
                        $scope.results.push({test:test, status:'Failure', result:result, time:duration});   
                    }
                }else{
                    $scope.results.push({test:test, status:'Hard Failure', result:result, time:duration});
                }
            });
        }else if(test.method == 'POST'){
            $http.post($scope.baseUrl + test.path, test.inputBody, test.inputConfig).success(function(data, status, headers, config){
                duration = (new Date()).getTime() - duration;
                var result = {
                    data:data,
                    status:status,
                    headers:headers,
                    config:config
                };
                if(data == test.output){
                    $scope.results.push({test:test, status:'Success', result:result, time:duration});
                }else{
                    $scope.results.push({test:test, status:'Failure', result:result, time:duration});
                }
            }).error(function(data, status, headers, config){
                duration = (new Date()).getTime() - duration;
                var result = {
                    data:data,
                    status:status,
                    headers:headers,
                    config:config
                };
                if(resultStatus == status){
                    if(data == test.output){
                        $scope.results.push({test:test, status:'Success', result:result, time:duration});
                    }else{
                        $scope.results.push({test:test, status:'Failure', result:result, time:duration});   
                    }
                }else{
                    $scope.results.push({test:test, status:'Hard Failure', result:result, time:duration});
                }
            });
        }else if(test.method == 'DELETE'){
            $http.delete($scope.baseUrl + test.path, test.inputConfig).success(function(data, status, headers, config){
                duration = (new Date()).getTime() - duration;
                var result = {
                    data:data,
                    status:status,
                    headers:headers,
                    config:config
                };
                if(data == test.output){
                    $scope.results.push({test:test, status:'Success', result:result, time:duration});
                }else{
                    $scope.results.push({test:test, status:'Failure', result:result, time:duration});
                }
            }).error(function(data, status, headers, config){
                duration = (new Date()).getTime() - duration;
                var result = {
                    data:data,
                    status:status,
                    headers:headers,
                    config:config
                };
                if(resultStatus == status){
                    if(data == test.output){
                        $scope.results.push({test:test, status:'Success', result:result, time:duration});
                    }else{
                        $scope.results.push({test:test, status:'Failure', result:result, time:duration});   
                    }
                }else{
                    $scope.results.push({test:test, status:'Hard Failure', result:result, time:duration});
                }
            });
        }else if(test.method == 'JSONP'){
            $http.jsonp($scope.baseUrl + test.path, test.inputConfig).success(function(data, status, headers, config){
                duration = (new Date()).getTime() - duration;
                var result = {
                    data:data,
                    status:status,
                    headers:headers,
                    config:config
                };
                if(data == test.output){
                    $scope.results.push({test:test, status:'Success', result:result, time:duration});
                }else{
                    $scope.results.push({test:test, status:'Failure', result:result, time:duration});
                }
            }).error(function(data, status, headers, config){
                duration = (new Date()).getTime() - duration;
                var result = {
                    data:data,
                    status:status,
                    headers:headers,
                    config:config
                };
                if(resultStatus == status){
                    if(data == test.output){
                        $scope.results.push({test:test, status:'Success', result:result, time:duration});
                    }else{
                        $scope.results.push({test:test, status:'Failure', result:result, time:duration});   
                    }
                }else{
                    $scope.results.push({test:test, status:'Hard Failure', result:result, time:duration});
                }
            });
        }else if(test.method == 'HEAD'){
            $http.head($scope.baseUrl + test.path, test.inputConfig).success(function(data, status, headers, config){
                duration = (new Date()).getTime() - duration;
                var result = {
                    data:data,
                    status:status,
                    headers:headers,
                    config:config
                };
                if(data == test.output){
                    $scope.results.push({test:test, status:'Success', result:result, time:duration});
                }else{
                    $scope.results.push({test:test, status:'Failure', result:result, time:duration});
                }
            }).error(function(data, status, headers, config){
                duration = (new Date()).getTime() - duration;
                var result = {
                    data:data,
                    status:status,
                    headers:headers,
                    config:config
                };
                if(resultStatus == status){
                    if(data == test.output){
                        $scope.results.push({test:test, status:'Success', result:result, time:duration});
                    }else{
                        $scope.results.push({test:test, status:'Failure', result:result, time:duration});   
                    }
                }else{
                    $scope.results.push({test:test, status:'Hard Failure', result:result, time:duration});
                }
            });
        }else{
            alert('invalid method: ' + test.method);
        }
    };
}