'use strict';

/* Controllers */

angular.module('Heimdall.controllers').
 controller('HomeController', ['$scope','$http','$routeParams',function($scope, $http, $routeParams) {

    $scope.activitycounts={};
    $scope.journals ={};
    function refreshActivityGroupCount(){
        var result={};
        $http.get('/api/activities/counts')
            .success(function(data) {
                
                $scope.activitycounts = data;
                result = data;
                    
                var newTypeArray =[];
                $.each(result, function(i, obj){
                    newTypeArray.push([obj._id, parseInt(obj.type)]);
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
                             
            });   

        $http.get('/api/activities/status/counts')
            .success(function(data) {
                
                $scope.activitystatuscounts = data;
                result = data;
 
               // var newStatusArray =[];
                var statusstyle= '';
                
                var statusdata = new google.visualization.DataTable();        
                statusdata.addColumn('string','Status');
                statusdata.addColumn('number','Instance');
                statusdata.addColumn({type: 'string', role:'style'});
                
                $.each(result, function(i, obj){

                 switch(obj._id){
                        case 'NEW'      : statusstyle= "color:green";
                                        break;
                        case 'ASSIGNED' : statusstyle= "color:blue";
                                        break;
                        case 'CLOSED' : statusstyle= "color:gray";
                                        break;
                    };
                statusdata.addRow([obj._id, obj.status, statusstyle ]);
                
                });
                var options = {
                  title: 'By Activity Status',
                };
                var statuschart = new google.visualization.BarChart(document.getElementById('activitystatusdiv'));
                statuschart.draw(statusdata, options);
            });   
    };

         refreshActivityGroupCount();
     
    $scope.getDivText = function(body, id){
        var n= body.indexOf('<');
        var readlink = "&nbsp;&nbsp;&nbsp;...<i><a href=\'#/journal/find/"  + id + "\'><small>read more</small></a></i></p> ";
        var leadTextNormal = body.substring(0,n) +  readlink;
        var parser = new DOMParser();
        var doc = parser.parseFromString('<entry>' + body + '</entry>',"text/xml");
        var innerText = doc.firstChild.firstChild.innerHTML;
        var leadtext = (innerText === undefined)?"<p><i><a href=\'#/journal/find/"  + id + "\'><small>read more</small></a></i></p>": "<p>" + doc.firstChild.firstChild.innerHTML + readlink;
        return (n>1)?leadTextNormal:leadtext;
    }; 
     
    $http.get('/api/activities/lastfive')
	.success(function(data) {
            $scope.activities = data;
	})
	.error(function(data) {
            console.log('Error in GET /api/activities/lastfive ' + data);
	});
        
   $http.get('/api/journals/lastfive')
	.success(function(data) {
            $scope.journals = data;
	})
	.error(function(data) {
            console.log('Error in GET /ap/journals/lastfive: ' + data);
	});     

    $scope.isDateDue = function(duedate){
        var tdate = new Date(duedate);
        var today = new Date(); 
        return (new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime()) >=  (new Date(tdate.getFullYear(), tdate.getMonth(), tdate.getDate()).getTime());
    };      





  }]);