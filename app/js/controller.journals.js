'use strict';

/* Controllers */

angular.module('Heimdall.controllers').
 controller('JournalController', ['$scope','$http','$routeParams','$location',function($scope, $http, $routeParams, $location) {
                
        if($routeParams._id === undefined){
            $http.get('/api/journals')
		.success(function(data) {
			$scope.journals = data;
		})
		.error(function(data) {
			console.log('Error in GET /api/journals: ' + data);
                });
        }else{
            $http.get('/api/journals/find/' + $routeParams._id)
		.success(function(data) {
			$scope.journals = data;
		})
		.error(function(data) {
			console.log('Error in GET /api/journals/find: ' + data);
                });
        };        


$scope.postJournal = function(isValid) {
            var jform ={title : $scope.title, htmlcontent : $scope.htmlcontent};
                if(isValid){ 
                    $http.post('/api/journals/add', jform)
                            .success(function(data) {
                            })
                            .error(function(data) {
                                    console.log('Error in POST /api/journals/add: ' + data);
                            });
                   
                };
            $scope.journalForm.$setPristine();
            $location.path("journal");
	};
       

    $scope.printDiv = function(divName) {
      var printContents = document.getElementById(divName).innerHTML;
      var originalContents = document.body.innerHTML;        
      var popupWin = window.open('', '_blank', 'width=300,height=300');
      popupWin.document.open()
      popupWin.document.write('<html><head><link rel="stylesheet" type="text/css" href="style.css" /></head><body onload="window.print()">' + printContents + '</html>');
      popupWin.document.close();
    }; 

    ////
    // Masquerade perfers the scope value over the innerHTML
    // Uncomment this line to see the effect:
    // $scope.htmlcontenttwo = "Override originalContents";
        $scope.htmlcontent= "";
        $scope.journalForm = {title1:"aa",orightml: '<h2>Try me!</h2><p>textAngular is a super cool WYSIWYG Text Editor directive for AngularJS</p><p><img class="ta-insert-video" ta-insert-video="http://www.youtube.com/embed/2maA1-mvicY" src="" allowfullscreen="true" width="300" frameborder="0" height="250"/></p><p><b>Features:</b></p><ol><li>Automatic Seamless Two-Way-Binding</li><li>Super Easy <b>Theming</b> Options</li><li style="color: green;">Simple Editor Instance Creation</li><li>Safely Parses Html for Custom Toolbar Icons</li><li class="text-danger">Doesn&apos;t Use an iFrame</li><li>Works with Firefox, Chrome, and IE8+</li></ol><p><b>Code at GitHub:</b> <a href="https://github.com/fraywing/textAngular">Here</a> </p><p>昮朐 魡 燚璒瘭 譾躒鑅, 皾籈譧 紵脭脧 逯郹酟 煃 瑐瑍, 踆跾踄 趡趛踠 顣飁 廞 熥獘 豥 蔰蝯蝺 廦廥彋 蕍蕧螛 溹溦 幨懅憴 妎岓岕 緁, 滍 蘹蠮 蟷蠉蟼 鱐鱍鱕, 阰刲 鞮鞢騉 烳牼翐 魡 骱 銇韎餀 媓幁惁 嵉愊惵 蛶觢, 犝獫 嶵嶯幯 縓罃蔾 魵 踄 罃蔾 獿譿躐 峷敊浭, 媓幁 黐曮禷 椵楘溍 輗 漀 摲摓 墐墆墏 捃挸栚 蛣袹跜, 岓岕 溿 斶檎檦 匢奾灱 逜郰傃</p>'};
	$scope.journalForm.htmlcontent = $scope.journalForm.orightml;
	$scope.journalForm.title = $scope.journalForm.title1;
  }]);