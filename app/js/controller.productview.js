'use strict';

/* Controllers */

angular.module('Heimdall.controllers').
 controller('ProductViewController', ['$scope','$http','$routeParams','$filter',function($scope, $http, $routeParams,$filter) {
    console.log('ProductController Init');

     
    $scope.actorArray = [];
  //  $scope.products = [];
    $scope.product = {};
    $scope.allusers = [];
    $scope.allAssignedUsers = [];
    $scope.showAllActors = false;
  
    /* Mock Data */
    $scope.actorRoles=[
        {role:'None', text:'None'},
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
        {_id: 'janiston', role:'ProjectManager'},
        {_id: 'ahathaway', role:'TechnologyLead'}
    ];
    */
    $scope.projectTypes = [
    {value: 'FCRA', text: 'FCRA'},
    {value: 'Non-FCRA', text: 'Non-FCRA'},
    {value: 'ISS Design', text: 'ISS Design'}
    ];      
    
    /*********************/
    
    /* find product */
    
    $scope.findProductDetail = function(productId){
        console.log('findProductDetail called for product id '+ productId);
        $http.get('/api/products/find/' + productId)
        .success(function(data) {
             console.log(data);
           $scope.product = data[0];  
         })
        .error(function(data) {
            console.log('Error in /api/products/find/ ' + data);
        });
    };
    
    $scope.findProductDetail($routeParams._id);
    
    
    var getProductActivityCounts = function(){
        console.log('getProductActivityCounts called');
        $http.get('/api/products/activitycounts/' + $routeParams._id)
            .success(function(data) {
                //    $scope.productactivity = data;
            
                //$scope.activitycounts = data;
                //result = data;
                    
                var newTypeArray =[];
                $.each(data, function(i, obj){
                    newTypeArray.push([obj._id.type, parseInt(obj.total)]);
                });
 
                var typedata = new google.visualization.DataTable();
                typedata.addColumn('string','Type');
                typedata.addColumn('number','Instance');
                typedata.addRows(newTypeArray);
                var options = {
                  title: 'By Activity Type'
                };
                var typechart = new google.visualization.PieChart(document.getElementById('activitytypediv'));
                typechart.draw(typedata, options);
            })
            .error(function(data) {
                    console.log('Error in GET /api/products/activitycounts ' + data);
            });
    
    };
    getProductActivityCounts();
    
    $http.get('/api/activities/findlastfive/'+  $routeParams._id)
       .success(function(data) {
           $scope.lastfiveactivities = data;
       })
       .error(function(data) {
           console.log('Error in GET /api/activities/findlastfive ' + data);
       });

    
    $http.get('/api/models/findbyproduct/'+  $routeParams._id)
       .success(function(data) {
           $scope.productmodels = data;
       })
       .error(function(data) {
           console.log('Error in GET /api/models/findbyproduct ' + data);
       });
   
    $http.get('/api/resources/findbyproduct/'+  $routeParams._id)
       .success(function(data) {
           $scope.resources = data;
           console.log('GET /api/resources/findbyproduct resource found: ' + data);
       })
       .error(function(data) {
           console.log('Error in GET /api/resources/findbyproduct ' + data);
       });
    
   
    $scope.updateProduct = function(product){
        console.log("updateProduct called");

         $http.post('/api/products/update', product)
                        .success(function(data) {
                            //$scope.gatherUsers();
                           // $scope.showNewActor = true;
                           // $('#updateActor').modal('hide');
                        })
                        .error(function(data) {
                            console.log('error: POST /api/products/update');
                        });
                   
    };

    $scope.showProjectTypes = function() {
        console.log('showProjectTypes called');
        var selected = $filter('filter')($scope.projectTypes, {value: $scope.product.projectType});
        return ($scope.product.projectType && selected.length) ? selected[0].text : 'Not set';
    };
    
    var refreshProductUsers = function(){
        var ausers = $scope.actorMatrix.filter(function(rec){
            return rec.role != 'None' ;
        });
        $scope.productusers = ausers;
    };
    
    // Create a matrix of all users and all users assigned to the product and their roles
    $scope.buildUserMatrix = function(){
        console.log('buildUserMatrix called');
        var actorMatrix = [];
        
        $http.get('/api/users')
         .success(function(data) {
                $scope.allusers = data;
                $scope.assignedusers = $scope.product.actors;
                console.log("assignedusers");
                console.log($scope.assignedusers);
                var found = false;
                for (var i = 0; i < $scope.allusers.length; i++){
                    found = false;
                    for(var j = 0; $scope.assignedusers != undefined && $scope.assignedusers.length >0 && j < $scope.assignedusers.length; j++){
                        if($scope.assignedusers[j]._id === $scope.allusers[i]._id){
                          console.log('processing assigned user ' +$scope.assignedusers[j]._id);
                          found = true; 
                          actorMatrix.push({_id:$scope.assignedusers[j]._id, role:$scope.assignedusers[j].role, imagename:$scope.allusers[i].imagename,name:$scope.allusers[i].name, email:$scope.allusers[i].email});
                          break;
                        };
                    };
                    if(!found){
                        actorMatrix.push({_id:$scope.allusers[i]._id, role:'None', imagename:$scope.allusers[i].imagename,name:$scope.allusers[i].name, email:$scope.allusers[i].email});
                    }
                }
                $scope.actorMatrix = actorMatrix;
                refreshProductUsers();
            })
             .error(function(data) {
                     console.log('Error: ' + data);
        });
    };     

    $scope.buildUserMatrix();
         
    $scope.assignRoleToActor = function(actorId, role){
        console.log('assignRoleToActor called for actor ' + actorId );
        role = angular.element('#actorRole_'+ actorId).val();
        var item = $scope.actorMatrix.filter(function(rec){
                return rec._id === actorId ;
            });
        console.log("item is ");    
        console.log(item[0]);
        if(item[0] != undefined){
            console.log('found ' + item[0]._id)
            item[0].role = role;
        };        
    };     


    $scope.saveChanges = function(){
        var items = $scope.actorMatrix.filter(function(rec){
                return rec.role != 'None';
            });
        $scope.product.actors = items;
        
        $http.post('/api/products/updateactors', $scope.product)
                  .success(function(data) {
                    $scope.assignedusers = $scope.product.actors;
                      //$scope.gatherUsers();
                     // $scope.showNewActor = true;
                     // $('#updateActor').modal('hide');
                  })
                  .error(function(data) {
                      console.log('error: POST /api/products/updateactors');
                  });
        $scope.showAllActors = false;
        refreshProductUsers();
        console.log($scope.product);
    };

/*
    $scope.usersAssignedToProduct = function(_id){
        console.log('usersAssignedToProduct called');
        $scope.allAssignedUsers = $scope.product.actors;
        
        $http.get('/api/users')
                 .success(function(data) {
                        $scope.allusers = data;
                        console.log(data);
                 })
                 .error(function(data) {
                         console.log('Error: ' + data);
         });
        
    };
    */
    /*
    $scope.assignUserWithRoleToProduct = function(productid, actorid){
        console.log('assignUserWithRoleToProduct called');
        console.log('assigning ' + actorid + ' to ' + productid);
        var productActors = $scope.product.actors;
    
        $scope.allAssignedUsers = $scope.product.actors;
        
    };
    */
        
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
    
    
    $scope.findUserInAssignedList = function(id){
                console.log('findUsersInAssignedList called');

      return $scope.actorArray.indexOf(id) != -1; 
    };
    */

    $scope.showAllActorsForEdit = function(){
        $scope.showAllActors = true;
    };
    $scope.hideAllActors = function(){
        $scope.showAllActors = false;
    };    
    
    
    /* begin services */
   
    $scope.showAllServicesForEdit = function(){
        $scope.showAllServices = true;
    };
    $scope.hideAllServices = function(){
        $scope.showAllServices = false;
    };    
    
        
    var refreshProductServices = function(){
        var aservices = $scope.servicesMatrix.filter(function(rec){
            return rec.selected === true  ;
        });
                console.log('assignedservices is ');
                console.log($scope.servicesMatrix);
        
        $scope.assignedservices = aservices;
    };
    
    
    $scope.buildServiceMatrix = function(){
        console.log('buildServiceMatrix called');
        var servicesMatrix = [];
        
        $http.get('/api/dataservices')
         .success(function(data) {
                $scope.allservices = data;
                console.log('allservices is x ');
                console.log($scope.allservices);
                $scope.assignedservices = $scope.product.dataservices;
                console.log('assignedservices is x ');
                console.log($scope.assignedservices);
                var found = false;
                for (var i = 0; i < $scope.allservices.length; i++){
                    found = false;
                    for(var j = 0; $scope.assignedservices != undefined && $scope.assignedservices.length >0 && j < $scope.assignedservices.length; j++){
                        console.log('huff ' + $scope.assignedservices[j]._id + ' puff ' + $scope.allservices[i]._id);
                        if($scope.assignedservices[j] === $scope.allservices[i]._id){
                          console.log('processing assigned service ' +$scope.assignedservices[j]._id);
                          found = true; 
                          servicesMatrix.push({_id:$scope.assignedservices[j], description:$scope.allservices[i].description, selected:true});
                          break;
                        };
                    };
                    if(!found){
                        servicesMatrix.push({_id:$scope.allservices[i]._id, description:$scope.allservices[i].description, selected:false});
                    }
                }
                $scope.servicesMatrix = servicesMatrix;
                refreshProductServices();
            })
             .error(function(data) {
                     console.log('Error: ' + data);
        });
    };     

    $scope.buildServiceMatrix();
         
    $scope.assignRoleToActor = function(actorId, role){
        console.log('assignRoleToActor called for actor ' + actorId );
        role = angular.element('#actorRole_'+ actorId).val();
        var item = $scope.actorMatrix.filter(function(rec){
                return rec._id === actorId ;
            });
        console.log("item is ");    
        console.log(item[0]);
        if(item[0] != undefined){
            console.log('found ' + item[0]._id)
            item[0].role = role;
        };        
    };     


    $scope.saveServiceChanges = function(){
        var items = $scope.servicesMatrix.filter(function(rec){
                return rec.selected === true;
            });
        $scope.product.dataservices = items;
        $http.post('/api/products/updateservices', $scope.product)
                  .success(function(data) {
                    $scope.assignedservices = $scope.product.dataservices;
                      //$scope.gatherUsers();
                     // $scope.showNewActor = true;
                     // $('#updateActor').modal('hide');
                  })
                  .error(function(data) {
                      console.log('error: POST /api/products/updateservices');
                  });
        $scope.showAllServices = false;
        refreshProductServices();
        console.log($scope.product);
    };


         

    /* end services */
  }]);