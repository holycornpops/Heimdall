'use strict';

/* Controllers */
angular.module('Heimdall.controllers', []);
/*
angular.module('Heimdall.controllers', []).
  controller('MyCtrl1', ['$scope', function($scope) {
          $scope.wow = 'hello world';
  }])
  .controller('MyCtrl2', [function($scope) {
  }])
  .controller('ActivityController', ['$scope','$http',function($scope, $http) {

        $scope.ActivityTypes =[{type:"Feature"},{type:"Bug"},{type:"Task"}];  



    function xinspect(o,i){
    if(typeof i=='undefined')i='';
    if(i.length>50)return '[MAX ITERATIONS]';
    var r=[];
    for(var p in o){
        var t=typeof o[p];
        r.push(i+'"'+p+'" ('+t+') => '+(t=='object' ? 'object:'+xinspect(o[p],i+'  ') : o[p]+''));
    }
    return r.join(i);
}

        $scope.updateActivity = function  (activityx){
            alert("inside updateActivity");
            alert(" ->" + activityx._id);
            return;
        };
        
        $scope.addActivityDetail = function  (activityx){
            alert("inside addDetail");
                 
            $http.post('/api/activities/addactivitydetail', activityx)
                    .success(function(data) {
                            activityx.details.push({detail:activityx.newDetail,createdBy:"System"});
                            activityx.newDetail=""; 
                            console.log(data);
                    })
                    .error(function(data) {
                                alert("Error in addactivitydetail " + data);
                    });


           
            activityx.$setPristine();

        };
               //$scope.formData.type = "Task"; 
               
        $http.get('/api/activities')
		.success(function(data) {
			$scope.activities = data;
                       console.log(data);
		})
		.error(function(data) {
			console.log('Error: ' + data);
		});

        function refreshActivityGroupCount(){
            $http.get('/api/activities/counts')
		.success(function(data) {
			$scope.activitycounts = data;
                       console.log(data);
		})
		.error(function(data) {
			console.log('Error: ' + data);
		});
        };        
        

        $scope.createActivity = function(isValid) {
           
                if(isValid){ 
                    $http.post('/api/activities/add', $scope.formData)
                            .success(function(data) {
                                    $scope.formData.activityName="";
                                    $scope.formData.type="";
                                    $scope.formData.detail="";
                                    $scope.formData.createdBy=""; // clear the form so our user is ready to enter another
                                    refreshActivityGroupCount();
                                    $scope.activities = data;
                                    console.log(data);
                            })
                            .error(function(data) {
                                    console.log('Error: ' + data);
                            });
                   
                };
            $scope.formData.$setPristine();

	};
        refreshActivityGroupCount();
       
  }])
.controller('UsersControllerxxx', ['$scope','$http','$routeParams',function($scope, $http, $routeParams) {

        alert("usersController");  
        $http.get('/api/users')
		.success(function(data) {
			$scope.users = data;
                       console.log(data);
		})
		.error(function(data) {
			console.log('Error: ' + data);
		});
                
        $scope.getAvatar = function(id){
            alert($routeParams.id);
                $http.get('/api/users/avatar/' + id)
		.success(function(data) {
			$scope.avatar = data;
		})
		.error(function(data) {
			console.log('Error: ' + data);
		});
        };
  }]);
  */