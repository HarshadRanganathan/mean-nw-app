var module = angular.module('easyTMApp');

module.factory('LoginService', ['$http', function ($http) {
  return {
    checkUser: function (id, callback) {
      $http.get('/user/search/' + id).then(callback);
    },
    createUser: function (data, callback) {
      $http.post('/user/new', data).then(callback);
    }
  }
}]);
