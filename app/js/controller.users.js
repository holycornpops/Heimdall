'use strict';

/* Controllers */

angular.module('Heimdall.controllers').
 controller('UsersController', ['$scope','$http','$routeParams',function($scope, $http, $routeParams) {

        $scope.randomNum = new Date().getTime();
        $scope.userid =$routeParams._id;
        var formData = new FormData();
        $scope.formData = formData;
        $scope.formData._id = $routeParams._id;
        $scope.showNewActor = true;
        
        $scope.getCurrentTime = function(){
            return new Date().getTime();
        };
        $scope.closeUpdate = function(formData){
            $scope.formData.$setPristine();
            $scope.editData.$setPristine();
                    // $scope.formData= {};
            //$scope.editData= {};
            $scope.showNewActor=true;
        };
        
        $scope.editUser = function(id){
            $http.get('/api/users/find/' + id)
		.success(function(data) {
                       $scope.editData._id = data._id; 
                       $scope.editData.name=data.name;
                       $scope.editData.email = data.email;
                       $scope.editData.imagename = data.imagename;
                       //$scope.formData = formData;        
                       // $scope.showNewActor = false;
		})
		.error(function(data) {
                    console.log('error: in GET /api/users/find');
                    $scope.editData.$setPristine();
		});

            };        
        //$scope.formData = formData.email;        

        $scope.gatherUsers = function(){
            $http.get('/api/users')
                    .success(function(data) {
                            $scope.users = data;
                           console.log(data);
                    })
                    .error(function(data) {
                            console.log('Error: ' + data);
            });
        
        };
        $scope.gatherUsers();      


    
        $scope.updateUser = function  (isValid){
            if(isValid){ 
                $http.post('/api/users/update', $scope.editData)
                        .success(function(data) {
                            $scope.gatherUsers();
                           // $scope.showNewActor = true;
                            $('#updateActor').modal('hide');
                        })
                        .error(function(data) {
                            console.log('error: POST /api/users/update');
                        });
                   
                };
          
        };        
        
        $scope.flowComplete = function(){
          alert("Flow COMLETE");  
          $scope.showNewActor = true;
          $scope.randomNum = new Date().getTime();
          $scope.$apply();
          return true;
        };

        $scope.uploader = {};

        $scope.upload = function () {
                $scope.uploader.flow.files[0].name = $scope.editData._id;
                //$scope.uploader.flow.wawa ='abcde'; ;
                $scope.uploader.flow.upload();  
                $scope.uploader.flow.files=[];
                $scope.randomNum = new Date().getTime();
                //$scope.gatherUsers();
                //alert("Switching");
                //$scope.$apply();
                //alert($scope.uploader.flow.files[0].name);
                     //$http.post('/api/users/upload').success(function(data){alert(data);}).error(function(data){alert("error" + data)});
        };
        
        $scope.getAvatar = function(id){
                $http.get('/api/users/avatar/' + id)
		.success(function(data) {
			//$scope.avatar = data;
                        //alert(data);
                       // user.avatarImage = data;    
		})
		.error(function(data) {
			console.log('Error in GET /api/users/avatar/: ' + data);
		});
        };
        
        
        $scope.createUser = function  (isValid){
            if(isValid){ 
                $http.post('/api/users/add', $scope.formData)
                        .success(function(data) {
                                $scope.formData._id="";
                                $scope.formData.name="";
                                $scope.formData.email="";
                                $scope.formData.createdBy=""; // clear the form so our user is ready to enter another
                                $scope.users=data;
                                console.log(data);
                        })
                        .error(function(data) {
                                console.log('Error in POST /api/users/add: ' + data);
                        });
                };
            $scope.formData.$setPristine();
        };        
        
        
        
        
        
       $scope.fileUploadedAndFormSubmitted = function($file, $message){
              alert("fileUploadedandSumitted called");
        };
        
    /*
        $scope.submit = function(formData){
            alert("Form Submitted " + $scope.formData);
                 $http.post('/api/users/add/' )
		.success(function(data) {
                    alert('post success');
		})
		.error(function(data) {
			console.log('Error: ' + data);
		});
        };
      
       function onSubmit(file, message){
            alert("onsumbit called");
        };
        function fileUploaded(file, message){
            alert("fileUploaded called");
            console.log("FileUploaded called");
        };
        
        $scope.$on('flow::fileAdded', function (event, $flow, flowFile) {
            alert("prevent file from uploading");
        });
       $scope.addUser = function  (isValid){
            alert("inside addUser");
            alert("Name " );
            alert($scope.aformData.CC);
          //  $scope.debugger=xinspect($scope.aformData);
            alert('end');
            */
/*                 
            $http.post('/api/users/add', userForm)
                    .success(function(data) {
                            activityx.details.push({detail:activityx.newDetail,createdBy:"System"});
                            activityx.newDetail=""; 
                            console.log(data);
                    })
                    .error(function(data) {
                                alert("Error in addactivitydetail " + data);
                    });


           
            activityx.$setPristine();

        };        */
  }]);