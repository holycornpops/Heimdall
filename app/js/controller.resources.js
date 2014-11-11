'use strict';

/* Controllers */

angular.module('Heimdall.controllers').
 controller('ResourcesController', ['$scope','$http','$routeParams','$upload',function($scope, $http, $routeParams, $upload) {

    $scope.selectedfile ={};
    $scope.onFileSelect = function($files){
        console.log('onFileSelect before');
        console.log($files);
        //$scope.formData.fname = '';
        $scope.formData.fname = $files[0];
        console.log('onFileSelect after');
        console.log($files);
        $scope.selectedfile = $files[0];
        console.log($scope.selectedfile);
        
        
    };
    
    $scope.gatherResources = function(){
        $http.get('/api/resources')
                .success(function(data) {
                        $scope.resources = data;
                       console.log(data);
                })
                .error(function(data) {
                        console.log('Error: ' + data);
        });
    };
  
    $scope.gatherResources();
    
    // Pull all products
    $http.get('/api/products')
    .success(function(data) {
            $scope.allproducts = data;
    })
    .error(function(data) {
            console.log('Error in GET /api/products ' + data);
    });
 
    $scope.addResource = function($files, isValid) {
    //$files: an array of files selected, each file has name, size, and type.
     console.log('addResource called');
      //var file = $files[0];
      var file = $scope.selectedfile;
      $scope.upload = $upload.upload({
        url: '/api/resource/upload', //upload.php script, node.js route, or servlet url
        method: 'POST', //'POST' or 'PUT',
        // headers: {'header-key': 'header-value'},
        // withCredentials: true,
        data: {target: $scope.formData.target, description: $scope.formData.description},
        file: file, // or list of files: $files for html5 only
        /* set the file formData name ('Content-Desposition'). Default is 'file' */
        //fileFormDataName: myFile, //or a list of names for multiple files (html5).
        /* customize how data is added to formData. See #40#issuecomment-28612000 for sample code */
        //formDataAppender: function(formData, key, val){}
      }).progress(function(evt) {
         $scope.showProgressBar = true; 
         var progressval =  parseInt(100.0 * evt.loaded / evt.total);
         console.log('percent: ' + progressval);
         if (progressval >= 100)
            $scope.showProgressBar = false; 
            
        $('.progress-bar').css('width', progressval+'%').attr('aria-valuenow', progressval);
      }).success(function(data, status, headers, config) {
          console.log('success called');
         $scope.showProgressBar = false;
         $scope.selectedfile = file;
         $scope.gatherResources();
        $('#addResource').modal('hide');

        // file is uploaded successfully
          //console.log(data);
      });
      //.error(...)
      //.then(success, error, progress); 
      //.xhr(function(xhr){xhr.upload.addEventListener(...)})// access and attach any event listener to XMLHttpRequest.
    /* alternative way of uploading, send the file binary with the file's content-type.
       Could be used to upload files to CouchDB, imgur, etc... html5 FileReader is needed. 
       It could also be used to monitor the progress of a normal http post/put request with large data*/
    // $scope.upload = $upload.http({...})  see 88#issuecomment-31366487 for sample code.
  };
        
  $scope.resetFileArray = function(){
    $scope.formData.fname ="";
  };
  



   $scope.removeFile = function(product,id, index){
       
    console.log(id);
    var c = confirm('Remove the resource ' + id + ' ?');
    if(c){
         $http.get('/api/resources/remove/'+ id)
                 .success(function(data){
                    console.log('success '); 
                 })
                 .error(function(data){
                    console.log('ERROR in GET /api/resources/remove ' + data); 
                     
                 });
        console.log($scope.resources.splice(index,1));   
        console.log(true);
    }else{
        console.log(false);
    };
   };
   
  }]);