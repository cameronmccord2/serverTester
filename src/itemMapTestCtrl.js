function itemMapTestCtrl($scope, $routeParams, $rootScope, $http, $location, $q){
    // add sorting to view
    $scope.results = new Array();
    $scope.sequences = new Array();
    $scope.sequence1 = {
        title:'First one',
        sequenceNumber:1,
        tests:new Array(),
        completed:true
    };
    $scope.sequence2 = {
        title:'Second one',
        sequenceNumber:2,
        tests:new Array(),
        completed:false
    };
    $scope.resultStatus = {
        success:"Success",
        failure:"Failure",
        hardError:"HardError",
        pending:"Pending",
        statusError:"StatusError"
    };
    $scope.methodTypes = [
        'GET',
        'PUT',
        'POST',
        'DELETE',
        'JSONP',
        'HEAD'
    ];
    $scope.testTypes = [
        'Setup',
        'DataCheck',
        'ChangeData',
        'Cleanup'
    ];
    $scope.sequence1.tests.push({method:"GET", path:'/itemMaper', inputBody:'asdf', type:'Setup', inputConfig:{params:{something:''}}, correctOutput:'', correctResultStatus:'', result:'', resultStatus:'', time:'', showExpandable:false});
    $scope.sequence2.tests.push({method:'GET', path:'/itemMaper', inputBody:'qwer', type:'DataCheck', inputConfig:{params:{something:''}}, correctOutput:'', correctResultStatus:'', result:'', resultStatus:'', time:'', showExpandable:false});
    $scope.sequence1.tests.push({method:"GET", path:'/itemMaper', inputBody:'asdf', type:'Setup', inputConfig:{params:{something:''}}, correctOutput:'', correctResultStatus:'', result:'', resultStatus:'', time:'', showExpandable:false});
    $scope.sequence2.tests.push({method:'GET', path:'/itemMaper', inputBody:'qwer', type:'DataCheck',  inputConfig:{params:{something:''}}, correctOutput:'', correctResultStatus:'', result:'', resultStatus:'', time:'', showExpandable:false});
    $scope.sequence1.tests.push({method:"GET", path:'/itemMaper', inputBody:'asdf', type:'Setup', inputConfig:{params:{something:''}}, correctOutput:'', correctResultStatus:'', result:'', resultStatus:'', time:'', showExpandable:false});
    $scope.sequence2.tests.push({method:'GET', path:'/itemMaper', inputBody:'qwer', type:'DataCheck',  inputConfig:{params:{something:''}}, correctOutput:'', correctResultStatus:'', result:'', resultStatus:'', time:'', showExpandable:false});
    $scope.sequence1.tests.push({method:"GET", path:'/itemMaper', inputBody:'asdf', type:'Setup', inputConfig:{params:{something:''}}, correctOutput:'', correctResultStatus:'', result:'', resultStatus:'', time:'', showExpandable:false});
    $scope.sequence2.tests.push({method:'GET', path:'/itemMaper', inputBody:'qwer', type:'DataCheck',  inputConfig:{params:{something:''}}, correctOutput:'', correctResultStatus:'', result:'', resultStatus:'', time:'', showExpandable:false});
    $scope.sequence1.tests.push({method:"GET", path:'/itemMaper', inputBody:'asdf', type:'Setup', inputConfig:{params:{something:''}}, correctOutput:'', correctResultStatus:'', result:'', resultStatus:'', time:'', showExpandable:false});
    $scope.sequence2.tests.push({method:'GET', path:'/itemMaper', inputBody:'qwer', type:'DataCheck',  inputConfig:{params:{something:''}}, correctOutput:'', correctResultStatus:'', result:'', resultStatus:'', time:'', showExpandable:false});
    $scope.sequence1.tests.push({method:"GET", path:'/itemMaper', inputBody:'asdf', type:'Setup', inputConfig:{params:{something:''}}, correctOutput:'', correctResultStatus:'', result:'', resultStatus:'', time:'', showExpandable:false});
    $scope.sequence2.tests.push({method:'GET', path:'/itemMaper', inputBody:'qwer', type:'DataCheck',  inputConfig:{params:{something:''}}, correctOutput:'', correctResultStatus:'', result:'', resultStatus:'', time:'', showExpandable:false});
    $scope.sequence1.tests.push({method:"GET", path:'/itemMaper', inputBody:'asdf', type:'Setup', inputConfig:{params:{something:''}}, correctOutput:'', correctResultStatus:'', result:'', resultStatus:'', time:'', showExpandable:false});
    $scope.sequence2.tests.push({method:'GET', path:'/itemMaper', inputBody:'qwer', type:'DataCheck',  inputConfig:{params:{something:''}}, correctOutput:'', correctResultStatus:'', result:'', resultStatus:'', time:'', showExpandable:false});
    $scope.sequence1.tests.push({method:"GET", path:'/itemMaper', inputBody:'asdf', type:'Setup', inputConfig:{params:{something:''}}, correctOutput:'', correctResultStatus:'', result:'', resultStatus:'', time:'', showExpandable:false});
    $scope.sequence2.tests.push({method:'GET', path:'/itemMaper', inputBody:'qwer', type:'DataCheck',  inputConfig:{params:{something:''}}, correctOutput:'', correctResultStatus:'', result:'', resultStatus:'', time:'', showExpandable:false});
    $scope.sequence1.tests.push({method:"GET", path:'/itemMaper', inputBody:'asdf', type:'Setup', inputConfig:{params:{something:''}}, correctOutput:'', correctResultStatus:'', result:'', resultStatus:'', time:'', showExpandable:false});
    $scope.sequence2.tests.push({method:'GET', path:'/itemMaper', inputBody:'qwer', type:'ChangeData',  inputConfig:{params:{something:''}}, correctOutput:'', correctResultStatus:'', result:'', resultStatus:'', time:'', showExpandable:false});
    $scope.sequence1.tests.push({method:"GET", path:'/itemMaper', inputBody:'asdf', type:'Cleanup', inputConfig:{params:{something:''}}, correctOutput:'', correctResultStatus:'', result:'', resultStatus:'', time:'', showExpandable:false});
    $scope.sequence2.tests.push({method:'GET', path:'/itemMaper', inputBody:'qwer', type:'ChangeData',  inputConfig:{params:{something:''}}, correctOutput:'', correctResultStatus:'', result:'', resultStatus:'', time:'', showExpandable:false});
    $scope.sequence1.tests.push({method:"GET", path:'/itemMaper', inputBody:'asdf', type:'Cleanup', inputConfig:{params:{something:''}}, correctOutput:'', correctResultStatus:'', result:'', resultStatus:'', time:'', showExpandable:false});
    $scope.sequence2.tests.push({method:'GET', path:'/itemMaper', inputBody:'qwer', type:'ChangeData',  inputConfig:{params:{something:''}}, correctOutput:'', correctResultStatus:'', result:'', resultStatus:'', time:'', showExpandable:false});
    $scope.sequence1.tests.push({method:"GET", path:'/itemMaper', inputBody:'asdf', type:'Cleanup', inputConfig:{params:{something:''}}, correctOutput:'', correctResultStatus:'', result:'', resultStatus:'', time:'', showExpandable:false});
    $scope.sequence2.tests.push({method:'GET', path:'/itemMaper', inputBody:'qwer', type:'ChangeData',  inputConfig:{params:{something:''}}, correctOutput:'', correctResultStatus:'', result:'', resultStatus:'', time:'', showExpandable:false});
    $scope.sequence1.tests.push({method:"GET", path:'/itemMaper', inputBody:'asdf', type:'Cleanup', inputConfig:{params:{something:''}}, correctOutput:'', correctResultStatus:'', result:'', resultStatus:'', time:'', showExpandable:false});
    $scope.sequence2.tests.push({method:'GET', path:'/itemMaper', inputBody:'qwer', type:'ChangeData',  inputConfig:{params:{something:''}}, correctOutput:'', correctResultStatus:'', result:'', resultStatus:'', time:'', showExpandable:false});
    $scope.sequence1.tests.push({method:"GET", path:'/itemMaper', inputBody:'asdf', type:'Cleanup', inputConfig:{params:{something:''}}, correctOutput:'', correctResultStatus:'', result:'', resultStatus:'', time:'', showExpandable:false});
    $scope.sequence2.tests.push({method:'GET', path:'/itemMaper', inputBody:'qwer', type:'ChangeData',  inputConfig:{params:{something:''}}, correctOutput:'', correctResultStatus:'', result:'', resultStatus:'', time:'', showExpandable:false});
    $scope.sequence1.tests.push({method:"GET", path:'/itemMaper', inputBody:'asdf', type:'Cleanup', inputConfig:{params:{something:''}}, correctOutput:'', correctResultStatus:'', result:'', resultStatus:'', time:'', showExpandable:false});
    $scope.sequence2.tests.push({method:'GET', path:'/itemMaper', inputBody:'qwer', type:'ChangeData',  inputConfig:{params:{something:''}}, correctOutput:'', correctResultStatus:'', result:'', resultStatus:'', time:'', showExpandable:false});
    $scope.sequence1.tests.push({method:"GET", path:'/itemMaper', inputBody:'asdf', type:'Cleanup', inputConfig:{params:{something:''}}, correctOutput:'', correctResultStatus:'', result:'', resultStatus:'', time:'', showExpandable:false});
    $scope.sequence2.tests.push({method:'GET', path:'/itemMaper', inputBody:'qwer', type:'ChangeData',  inputConfig:{params:{something:''}}, correctOutput:'', correctResultStatus:'', result:'', resultStatus:'', time:'', showExpandable:false});
    $scope.sequence1.tests.push({method:"GET", path:'/itemMaper', inputBody:'asdf', type:'Cleanup', inputConfig:{params:{something:''}}, correctOutput:'', correctResultStatus:'', result:'', resultStatus:'', time:'', showExpandable:false});
    $scope.sequence2.tests.push({method:'GET', path:'/itemMaper', inputBody:'qwer', type:'ChangeData',  inputConfig:{params:{something:''}}, correctOutput:'', correctResultStatus:'', result:'', resultStatus:'', time:'', showExpandable:false});
    $scope.sequence1.tests.push({method:"GET", path:'/itemMaper', inputBody:'asdf', type:'Cleanup', inputConfig:{params:{something:''}}, correctOutput:'', correctResultStatus:'', result:'', resultStatus:'', time:'', showExpandable:false});
    $scope.sequence2.tests.push({method:'GET', path:'/itemMaper', inputBody:'qwer', type:'ChangeData',  inputConfig:{params:{something:''}}, correctOutput:'', correctResultStatus:'', result:'', resultStatus:'', time:'', showExpandable:false});
    $scope.sequence1.tests.push({method:"GET", path:'/itemMaper', inputBody:'asdf', type:'Cleanup', inputConfig:{params:{something:''}}, correctOutput:'', correctResultStatus:'', result:'', resultStatus:'', time:'', showExpandable:false});
    $scope.sequence2.tests.push({method:'GET', path:'/itemMaper', inputBody:'qwer', type:'ChangeData',  inputConfig:{params:{something:''}}, correctOutput:'', correctResultStatus:'', result:'', resultStatus:'', time:'', showExpandable:false});
    $scope.sequence1.tests.push({method:"GET", path:'/itemMaper', inputBody:'asdf', type:'Cleanup', inputConfig:{params:{something:''}}, correctOutput:'', correctResultStatus:'', result:'', resultStatus:'', time:'', showExpandable:false});
    $scope.sequence2.tests.push({method:'GET', path:'/itemMaper', inputBody:'qwer', type:'ChangeData',  inputConfig:{params:{something:''}}, correctOutput:'', correctResultStatus:'', result:'', resultStatus:'', time:'', showExpandable:false});
    $scope.sequence1.tests.push({method:"GET", path:'/itemMaper', inputBody:'asdf', type:'Cleanup', inputConfig:{params:{something:''}}, correctOutput:'', correctResultStatus:'', result:'', resultStatus:'', time:'', showExpandable:false});
    $scope.sequence2.tests.push({method:'GET', path:'/itemMaper', inputBody:'qwer', type:'ChangeData',  inputConfig:{params:{something:''}}, correctOutput:'', correctResultStatus:'', result:'', resultStatus:'', time:'', showExpandable:false});
    

    
    $scope.sequences.push($scope.sequence1);
    $scope.sequences.push($scope.sequence2);
    console.log($scope.sequences);
    for (var j = $scope.sequences.length - 1; j >= 0; j--) {
        $scope.sequences[j].showExpandedSequence = true;
        console.log("sequence")
        for (var i = 0; i < $scope.sequences[j].tests.length; i++) {
            console.log('test')
            $scope.sequences[j].tests[i].resultStatus = 'NotStarted';
            $scope.sequences[j].tests[i].inputConfigJsonString = JSON.stringify($scope.sequences[j].tests[i].inputConfig);
        };
    };

    $scope.rowColor = function(index){
        if(index % 2)
            return 'evenRow';
        else
            return 'oddRow';
    }

    $scope.toggleExpandRow = function(index){
        if($scope.tests[index].showExpandable == true)
            $scope.tests[index].showExpandable = false;
        else
            $scope.tests[index].showExpandable = true;
    }

    $scope.toggle = function(object, m1, m2, m3){
        if(m3 && m2 && m1){
            if(object[m1][m2][m3] == false || object[m1][m2][m3] == null || object[m1][m2][m3] == undefined)
                object[m1][m2][m3] = true;
            else if(object[m1][m2][m3] == true)
                object[m1][m2][m3] = false;
        }else if(m2 && m1){
            if(object[m1][m2] == false || object[m1][m2] == null || object[m1][m2] == undefined)
                object[m1][m2] = true;
            else if(object[m1][m2] == true)
                object[m1][m2] = false;
        }else if(m1){
            if(object[m1] == false || object[m1] == null || object[m1] == undefined)
                object[m1] = true;
            else if(object[m1] == true)
                object[m1] = false;
        }
        return;
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
        var result = $scope.generateResult(data, status, headers, config);
        if(test.correctResultStatus == status){
            if(data == test.correctOutput){
                test = $scope.setResultInfo(test, $scope.resultStatus.success, result, duration);
            }else{
                test = $scope.setResultInfo(test, $scope.resultStatus.failure, result, duration);
            }
        }else{
            test = $scope.setResultInfo(test, $scope.resultStatus.statusError, result, duration);
        }
        return test;
    }

    for(testIndex in $scope.tests){
        var test = $scope.tests[testIndex];
        console.log(test);
        test.resultStatus = $scope.resultStatus.pending;
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