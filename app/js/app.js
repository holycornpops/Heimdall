'use strict';


// Declare app level module which depends on filters, and services
angular.module('Heimdall', [
  'textAngular',
  'ngRoute',
  'ui.bootstrap',
  'flow',
  'xeditable',
  'Heimdall.filters',
  'Heimdall.services',
  'Heimdall.directives',
  'Heimdall.controllers',
  'angularFileUpload',
  'ngAnimate'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/home', {templateUrl: 'partials/home.html', controller: 'HomeController'});
  $routeProvider.when('/view1', {templateUrl: 'partials/partial1.html', controller: 'MyCtrl1'});
  $routeProvider.when('/view2', {templateUrl: 'partials/partial2.html', controller: 'MyCtrl2'});
  $routeProvider.when('/activities', {templateUrl: 'partials/activities.html', controller: 'ActivityController'});
  $routeProvider.when('/activities/find/:_id', {templateUrl: 'partials/activities.html', controller: 'ActivityController'});
  $routeProvider.when('/activities/counts', {templateUrl: 'partials/activities.html', controller: 'ActivityController'});
  $routeProvider.when('/users', {templateUrl: 'partials/users.html', controller: 'UsersController'});
 // $routeProvider.when('/users/edit/:_id', {templateUrl: 'partials/users_edit.html', controller: 'UsersControllerUpdate'});
  $routeProvider.when('/users/edit/:_id', {templateUrl: 'partials/users.html', controller: 'UsersController'});
  $routeProvider.when('/journal/new', {templateUrl: 'partials/journal.html', controller: 'JournalController'});
  $routeProvider.when('/journal/find/:_id', {templateUrl: 'partials/journals.html', controller: 'JournalController'});
  $routeProvider.when('/journal', {templateUrl: 'partials/journals.html', controller: 'JournalController'});
  $routeProvider.when('/products', {templateUrl: 'partials/products.html', controller: 'ProductController'});
  $routeProvider.when('/products/find/:_id', {templateUrl: 'partials/productview.html', controller: 'ProductViewController'});
  $routeProvider.when('/models', {templateUrl: 'partials/models.html', controller: 'ModelController'});
  $routeProvider.when('/models/find/:_id', {templateUrl: 'partials/modelview.html', controller: 'ModelViewController'});
  $routeProvider.when('/resources/', {templateUrl: 'partials/resources.html', controller: 'ResourcesController'});
  $routeProvider.when('/dataservices/', {templateUrl: 'partials/dataservices.html', controller: 'DataServicesController'});

  $routeProvider.otherwise({redirectTo: '/home'});
}]).run(function(editableOptions) {
  editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
});
/*
.config(['flowFactoryProvider', function (flowFactoryProvider) {
  flowFactoryProvider.defaults = {
    target: '/api/users/upload',
    //target: '/users/upload',
    permanentErrors: [404, 500, 501],
    maxChunkRetries: 1,
    chunkRetryInterval: 5000,
    simultaneousUploads: 4,
    singleFile: true
  };
  flowFactoryProvider.on('catchAll', function (event) {
    //alert('catchAll'+  arguments);
  });
  // Can be used with different implementations of Flow.js
  // flowFactoryProvider.factory = fustyFlowFactory;
}]);
;
*/