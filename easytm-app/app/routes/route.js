var easyTMApp = angular.module('easyTMApp', [
  'ngRoute',
  'ngMaterial',
  'ngMdIcons',
  'NotificationModule',
  'ConfigurationModule',
  'NavModule',
  'TaskModule',
  'GroupModule',
  'DirectiveModule'
]);

easyTMApp.config(['$compileProvider', '$routeProvider', '$httpProvider', 'API_END_POINT', function function_name($compileProvider, $routeProvider, $httpProvider, API_END_POINT) {

  $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension):/);

  $httpProvider.interceptors.push(function () {
    return {
      request: function (req) {
        if (req.url.charAt(0) === '/') {
          req.url = API_END_POINT + req.url;
        }
        return req;
      }
    };
  });

  $httpProvider.interceptors.push('TokenInterceptor');

  $routeProvider.
    when('/', {
      templateUrl: 'app/views/login.html',
      controller: 'LoginController'
    }).
    when('/task', {
      templateUrl: 'app/views/task.html',
      controller: 'TaskController'
    }).
    when('/group/:groupId', {
      templateUrl: 'app/views/group.html',
      controller: 'GroupController'
    })
}])
