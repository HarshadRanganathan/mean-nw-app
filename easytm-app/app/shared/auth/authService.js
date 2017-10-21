var module = angular.module('easyTMApp');

module.factory('AuthService', ['$http', function ($http) {
  return {
    getToken: function (data, callback) {
      $http.post('/rest/authentication', data).then(callback);
    }
  }
}]);
