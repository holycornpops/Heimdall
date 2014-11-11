'use strict';

google.load('visualization', '1', {packages:['corechart']});

//google.setOnLoadCallback(function() {
//  angular.bootstrap(document.body, ['Heimdall']);
//});

/* Controllers */
angular.module('Heimdall.controllers')
.controller('ActivityController', ['$scope','$http','$routeParams',function($scope, $http, $routeParams) {

    $scope.ActivityTypes =[{type:"Feature"},{type:"Bug"},{type:"Task"}];  
    $scope.StatusTypes =[{type:"NEW"},{type:"ASSIGNED"},{type:"CLOSED"}]; 
    
    $scope.activities={};
    $scope.users={};
    $scope.activitycounts={};
    $scope.addActivityError = false;
    
    // Pull all products
    $http.get('/api/products')
    .success(function(data) {
            $scope.allproducts = data;
    })
    .error(function(data) {
            console.log('Error in GET /api/products ' + data);
    });

    
    function refreshActivityGroupCount(){
        var result={};;
        $http.get('/api/activities/counts')
            .success(function(data) {
                    $scope.activitycounts = data;
                    result = data;
      var newArray =[];
      $.each(result, function(i, obj){
          newArray.push([obj._id, parseInt(obj.type)]);
      });
 
      var data = new google.visualization.DataTable();
      data.addColumn('string','Type');
      data.addColumn('number','Instance');
      data.addRows(newArray);
      var options = {
        title: 'Open Activities'
      };
     // var chart = new google.visualization.PieChart(document.getElementById('chartdiv'));
 
     // chart.draw(data, options);
            
            })
            .error(function(data) {
                    console.log('Error in refreshActivityGroupCount : ' + data);
            });
    };        
        
    refreshActivityGroupCount();
       


    $http.get('/api/users')
             .success(function(data) {
                     $scope.users = data;
             })
             .error(function(data) {
                    console.log('Error in GET /api/users : ' + data);
        });
        $scope.findUserName = function(id){
            for(var i=0; i < $scope.users.length; i += 1){
              var result = $scope.users[i];
              if(result._id === id){
                  return {'name':result.name,'imagename':result.imagename};
              }
            };
            return "";
        };

        $scope.updateActivity = function  (activityx){
            $http.post('/api/activities/updateactivity',activityx)
                    .success(function(data){
                    })
                    .error(function(data){
                        console.log('Error un POST /api/activities/updateactivity');
                    });
            
            return;
        };
        
        $scope.addActivityDetail = function  (activityx){
            var createdBy = activityx.createdBy;
            $http.post('/api/activities/addactivitydetail', activityx)
                    .success(function(data) {
                            //$scope.activityx.createdBy = createdBy ;
                            //$scope.activityx.createdDate = new Date() ;
                            //socket.emit("new_activity",{my:'data'});
                            activityx.newDetail=""; 
                            socket.emit("new_activity",activityx);
                    })
                    .error(function(data) {
                            console.log('Error in POST /api/activities/addactivitydetail ' + data);
                    });
            //activityx.$setPristine();
        };
        //$scope.formData.type = "Task"; 
               
        if($routeParams._id === undefined){
            $http.get('/api/activities')
		.success(function(data) {
			$scope.activities = data;
		})
		.error(function(data) {
			console.log('Error in GET /api/activities: ' + data);
                });
        }else{
            $http.get('/api/activities/find/' + $routeParams._id)
		.success(function(data) {
			$scope.activities = data;
		})
		.error(function(data) {
			console.log('Error: in GET /api/activities/find ' + data);
                });
        };        

        $scope.createActivity = function(isValid) {
                //$scope.addActivityError = false;*
                if(isValid){ 
                    $http.post('/api/activities/add', $scope.formData)
                            .success(function(data) {
                                    $scope.formData.activityName="";
                                    $scope.formData.type="";
                                    $scope.formData.product="";
                                    $scope.formData.detail="";
                                    $scope.formData.createdBy=""; // clear the form so our user is ready to enter another
                                    refreshActivityGroupCount();
                                    $scope.activities = data;
                                    console.log(data);
                            })
                            .error(function(data) {
                                    console.log('Error in POST /api/activities/add : ' + data);
                                    $scope.addActivityError= true;      
                            });
                   
                }; //*/ $scope.addActivityError = true;
            if(!$scope.addActivityError)
                $scope.formData.$setPristine();

	};
       
      $scope.testdata = function(){
          $scope.testData = 'hello';
      }; 
     // $scope.testData ='';
  //-- Websocket listeners      
      var socket = io.connect('http://chidyhocx-w7d:8888');    
       socket.on('new_activity', function(data){
            //look for activity id from data and push the new detail in
              for(var i=0; i <= $scope.activities.length; i++){
                if($scope.activities[i]._id === data._id){
                  $scope.activities[i].details.push(data.detail);
                  $scope.activities[i].newDetail=""; 
                  break;
                } 
              };
              $scope.$digest();
        });

    socket.on('update_activity_detail', function(data){
         //look for activity id from data and push the new detail in
           var detailUpdated = false;
           for(var i=0; i < $scope.activities.length; i++){
            for(var x=0; x < $scope.activities[i].details.length; x++){   
                if($scope.activities[i].details[x]._id === data._id){
                  $scope.activities[i].details[x].detail = data.detail.detail;
                  detailUpdated = true;
                  break;
                } 
             if (detailUpdated)
                 break;
            }
           };
           $scope.$digest();
     });
        
        
    $scope.updateActivityDetail = function(detail){
      
        $http.post('/api/activities/updateactivitydetail', detail)
                .success(function(data) {
                })
                .error(function(data) {
                    console.log("Error in POST /api/activities/updateactivitydetail" + data);
                });
    }  ;   
  
   //---------------------
   // Date Functions
   
  $scope.today = function() {
    $scope.targetDate = new Date();
  };
  
  $scope.today();

  $scope.showWeeks = true;
  $scope.toggleWeeks = function () {
    $scope.showWeeks = ! $scope.showWeeks;
  };

  $scope.clear = function () {
    $scope.targetDate = null;
  };

  // Disable weekend selection
  $scope.disabled = function(date, mode) {
    return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
  };

  $scope.toggleMin = function() {
    $scope.minDate = ( $scope.minDate ) ? null : new Date();
  };
  $scope.toggleMin();

  $scope.open = function($event) {
    $event.preventDefault();
    $event.stopPropagation();

    $scope.opened = true;
  };

  $scope.dateOptions = {
    'year-format': "'yy'",
    'starting-day': 1,
    'show-weeks' : false
  };


  $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'shortDate'];
  $scope.dateFormat = $scope.formats[0];

  $scope.isDateDue = function(duedate){
      var tdate = new Date(duedate);
      var today = new Date(); 
      return (new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime()) >=  (new Date(tdate.getFullYear(), tdate.getMonth(), tdate.getDate()).getTime());
  };      
  
  $scope.gettime = function(duedate){
     var tdate = new Date(duedate);
     return new Date(tdate.getFullYear(), tdate.getMonth(), tdate.getDate()).getTime(); 
  };
  
  $scope.getcurrenttime = function(){
     var today = new Date(); 
     return new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime(); 
  };
  
  }]);
  