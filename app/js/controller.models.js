'use strict';

/* Controllers */

angular.module('Heimdall.controllers').
 controller('ModelController', ['$scope','$http','$routeParams','$filter',function($scope, $http, $routeParams,$filter) {
    console.log('ModelController Init');

     
    //$scope.actorArray = [];
    //$scope.allAssignedUsers = [];
    //$scope.showAllActors = false;
    /*
    if ($scope.products === undefined){
        $scope.products = [];
        var newProduct = {
            _id  : 'CDF',
            name : 'Claims Data Fill',
            description : 'Claims Data Fill with First Notice Of Loss and Attributes',
            projectType  : 'Non-FCRA',
            projectManager: 'Ben Saunders',
            productManager : 'Linda Haville',
            technicalLead : 'Jim Scott',
            qaLead :  'Jane Bentley'
            };
        $scope.products.push(newProduct);    
        $scope.product = newProduct;    
//        $scope.formData.name = newProduct.name;
//        console.log($scope.formData);
    }else{
        console.log('products not undefined');
        console.log($scope.products);
    }
    */
    /* Mock Data */
    
    //$scope.actorRoles=[
    //    {role:'ProjectManager', text:'Project Manager'},
    //    {role:'ProductManager', text:'Product Manager'},
    //    {role:'QualityAssurance',text:'Quality Assurance'},
    //    {role:'Audit', text:'Audit'},
    //    {role:'Modelling', text:'Modelling'},
    //    {role:'Engineering',text:'Engineering'},
    //    {role:'TechologyLead', text:'Techology Lead'}
    //];
    /*
    $scope.actorsWithRoles=[
        {_id: 'dyhocx'  , role:'Engineering' },
        {_id: 'janiston', role:'Project Manager'},
        {_id: 'ahathaway', role:'Technology Lead'}
    ];*/
    
    $scope.projectTypes = [
        {value: 'FCRA', text: 'FCRA'},
        {value: 'Non-FCRA', text: 'Non-FCRA'}
    ];      
   
    /*********************/
    
    $scope.showProjectTypes = function() {
        console.log('showProjectTypes called');
        var selected = $filter('filter')($scope.projectTypes, {value: $scope.product.projectType});
        return ($scope.product.projectType && selected.length) ? selected[0].text : 'Not set';
    };
    
    var refreshModels = function(){
        console.log('refreshModels called');
        $http.get('/api/models')
            .success(function(data) {
                    $scope.models = data;
            })
            .error(function(data) {
                    console.log('Error in GET /api/models ' + data);
            });
    
    };
    refreshModels();
   
   
       // Pull all products
    $http.get('/api/products')
    .success(function(data) {
            $scope.allproducts = data;
    })
    .error(function(data) {
            console.log('Error in GET /api/products ' + data);
    });

   
    $scope.createModel = function(isValid){
        console.log('createModel called');
        if(isValid){ 
            $http.post('/api/models/add', $scope.formData)
                    .success(function(data) {
                            $scope.formData._id="";
                            $scope.formData.name="";
                            $scope.formData.description="";
                             refreshModels();
                            $('#newModel').modal('hide');
                            console.log(data);
                    })
                    .error(function(data) {
                            console.log('Error in POST /api/models/add : ' + data);
                            $scope.addModelError= true;      
                    });

            }; 
            if(!$scope.addModelError)
                $scope.formData.$setPristine();
    } ;
    
  
  }]);