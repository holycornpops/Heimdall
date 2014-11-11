'use strict';

/* Controllers */

angular.module('Heimdall.controllers').
 controller('DataServicesController', ['$scope','$http','$routeParams','$filter',function($scope, $http, $routeParams,$filter) {
    console.log('DataServicesController Init');
    
    $scope.serviceTypes = [
        {value: 'Attribute', text: 'Attribute'},
        {value: 'SOAPCALL', text: 'SOAPCALL'}
    ];      
   
    /*********************/
    
    $scope.showServiceTypes = function(stype) {
        console.log('showServiceTypes called');
        var selected = $filter('filter')($scope.serviceTypes, {value: $scope.ds.servicetype});
        return ($scope.ds.servicetype && selected.length) ? selected[0].text : 'Not set';
    };
    
   
    var refreshDataServices = function(){
        console.log('refreshDataServices called');
        $http.get('/api/dataservices')
            .success(function(data) {
                    $scope.dataservices = data;
            })
            .error(function(data) {
                    console.log('Error in GET /api/dataservices ' + data);
            });
    
    };
    refreshDataServices();
    
    $scope.createDataService = function(isValid){
        console.log('createDataService called');
        if(isValid){ 
            $http.post('/api/dataservices/add', $scope.formData)
                    .success(function(data) {
                            $scope.formData._id ="";
                            $scope.formData.description ="";
                            $scope.formData.servicetype ="";
                            $scope.formData.attributename ="";
                            $scope.formData.servicename ="";
                            $scope.formData.requestlayout ="";
                            $scope.formData.responselayout ="";
                             refreshDataServices();
                            $('#newDataService').modal('hide');
                            console.log(data);
                    })
                    .error(function(data) {
                            console.log('Error in POST /api/dataservices/add : ' + data);
                            $scope.addModelError= true;      
                    });

            }; 
            if(!$scope.addDataServiceError)
                $scope.formData.$setPristine();
    } ;   
    
    
    $scope.updateDataService = function(ds){
        console.log("updateDataService called");

         $http.post('/api/dataservices/update', ds)
                        .success(function(ds) {
                        })
                        .error(function(ds) {
                            console.log('error: POST /api/dataservices/update');
                        });
                   
    };
    
   /*
       // Pull all products
    $http.get('/api/products')
    .success(function(data) {
            $scope.allproducts = data;
    })
    .error(function(data) {
            console.log('Error in GET /api/products ' + data);
    });

   
  
    */
  

    
  }]);