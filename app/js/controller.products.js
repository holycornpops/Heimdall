'use strict';

/* Controllers */

angular.module('Heimdall.controllers').
 controller('ProductController', ['$scope','$http','$routeParams','$filter',function($scope, $http, $routeParams,$filter) {
    console.log('ProductController Init');

     
    $scope.actorArray = [];
    $scope.allAssignedUsers = [];
    $scope.showAllActors = false;
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
    
    $scope.actorRoles=[
        {role:'ProjectManager', text:'Project Manager'},
        {role:'ProductManager', text:'Product Manager'},
        {role:'QualityAssurance',text:'Quality Assurance'},
        {role:'Audit', text:'Audit'},
        {role:'Modelling', text:'Modelling'},
        {role:'Engineering',text:'Engineering'},
        {role:'TechologyLead', text:'Techology Lead'}
    ];
    /*
    $scope.actorsWithRoles=[
        {_id: 'dyhocx'  , role:'Engineering' },
        {_id: 'janiston', role:'Project Manager'},
        {_id: 'ahathaway', role:'Technology Lead'}
    ];*/
    
    $scope.projectTypes = [
    {value: 'FCRA', text: 'FCRA'},
    {value: 'Non-FCRA', text: 'Non-FCRA'},
    {value: 'ISS Design', text: 'ISS Design'},
    {value: 'test', text:'test'}
    ];      
   
    /*********************/
    
    $scope.showProjectTypes = function() {
        console.log('showProjectTypes called');
        var selected = $filter('filter')($scope.projectTypes, {value: $scope.product.projectType});
        return ($scope.product.projectType && selected.length) ? selected[0].text : 'Not set';
    };
    
    var refreshProducts = function(){
        console.log('refreshProducts called');
        $http.get('/api/products')
            .success(function(data) {
                    $scope.products = data;
            })
            .error(function(data) {
                    console.log('Error in GET /api/products ' + data);
            });
    
    };
    refreshProducts();
    
    /*
    $scope.gatherUsers = function(){
                console.log('gatherUsers called');

         $http.get('/api/users')
                 .success(function(data) {
                        $scope.allusers = data;
                        console.log(data);
                 })
                 .error(function(data) {
                         console.log('Error: ' + data);
         });

     };
     $scope.gatherUsers(); 
    */
    
    $scope.usersAssignedToProduct = function(_id){
        console.log('usersAssignedToProduct called');
        $scope.allAssignedUsers = $scope.product.actors;
        /*
        $http.get('/api/users')
                 .success(function(data) {
                        $scope.allusers = data;
                        console.log(data);
                 })
                 .error(function(data) {
                         console.log('Error: ' + data);
         });
        */
    };
    /*
    $scope.assignUserWithRoleToProduct = function(productid, actorid){
        console.log('assignUserWithRoleToProduct called');
        console.log('assigning ' + actorid + ' to ' + productid);
        var productActors = $scope.product.actors;
    
        $scope.allAssignedUsers = $scope.product.actors;
        
    };
    */
   
    $scope.createProduct = function(isValid){
        console.log('createProduct called');
        if(isValid){ 
            // $scope.formData.actors=  $scope.actorArray ;
            $http.post('/api/products/add', $scope.formData)
                    .success(function(data) {
                            $scope.formData._id="";
                            $scope.formData.name="";
                            $scope.formData.description="";
                             refreshProducts();
                            $('#newProduct').modal('hide');
                            console.log(data);
                    })
                    .error(function(data) {
                            console.log('Error in POST /api/products/add : ' + data);
                            $scope.addProductError= true;      
                    });

            }; 
            if(!$scope.addProductError)
                $scope.formData.$setPristine();
    } ;
    
    /*
    $scope.toggleActorInAssignedList = function(id){
        console.log('toggleActorInAssignedList called');

        var found = false;
        for(var i =0; i<=$scope.actorArray.length; i++ ){
          if($scope.actorArray[i] == id){
              found = true;
              $scope.actorArray.splice(i,1);
          };
        };
          if (!found){
             $scope.actorArray.splice($scope.actorArray.length,1,id); 
          }
    };
    */
   /*
    $scope.findUserInAssignedList = function(id){
                console.log('findUsersInAssignedList called');

      return $scope.actorArray.indexOf(id) != -1; 
    };
    */
    /*
    $scope.classifyUsersToProduct = function(productId){
        
        $scope.allusers
        for(var i=0; i <= $scope.allusers.length; i++){
           if ($scope.actorsWithRoles.) 
        };
        //join actorsWithRoles to allusers
        
    };*/
/*
    $scope.showAllActorsForEdit = function(){
        $scope.showAllActors = true;
        console.log('showAllActorsForEdit called ' + $scope.showAllActors);
    };
    $scope.hideAllActors = function(){
        $scope.showAllActors = false;
        console.log('hideAllActors called ' + $scope.showAllActors);
    };    
    
    $scope.findActorRoleByProductId = function(productId){
      console.log('findActorRoleByProductId called for id ' +productId);
      return 'Modelling';
    };
*/
  }]);