var module = angular.module('easyTMApp');

module.factory('TokenInterceptor', ['$window', function ($window) {
  return {
    request: function (config) {
      config.headers['Authorization'] = 'Bearer ' + $window.sessionStorage.token;
      return config;
    }
  };
}]);
