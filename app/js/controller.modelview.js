'use strict';

/* Controllers */

angular.module('Heimdall.controllers').
 controller('ModelViewController', ['$scope','$http','$routeParams','$filter',function($scope, $http, $routeParams,$filter) {
    console.log('ModelViewController Init');

    $scope.classification=[
        {value : 'Non-FCRA', text: 'Non-FCRA'},
        {value : 'FCRA', text: 'FCRA'}
    ];

    $scope.modeltype=[
        {value : 'Scoring', text: 'Scoring'},
        {value : 'Attribute', text: 'Attribute'}
    ];

    /*********************/
    
    /* find product */
    
    $scope.findModelDetail = function(modelId){
        console.log('findModelDetail called for model id '+ modelId);
        $http.get('/api/models/find/' + modelId)
        .success(function(data) {
             console.log(data);
           $scope.model = data[0];  
         })
        .error(function(data) {
            console.log('Error in /api/models/find/ ' + data);
        });
    };
    
    $scope.findModelDetail($routeParams._id);
    
    
   
    $scope.updateModel = function(model){
        console.log("updateModel called");

         $http.post('/api/models/update', model)
                        .success(function(data) {
                        })
                        .error(function(data) {
                            console.log('error: POST /api/models/update');
                        });
                   
    };

     // Pull all products
    $http.get('/api/products')
    .success(function(data) {
            $scope.allproducts = data;
    })
    .error(function(data) {
            console.log('Error in GET /api/products ' + data);
    });

  }]);