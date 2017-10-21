var module = angular.module('NavModule');

module.factory('NavService', ['$http', function ($http) {
  return {
    getUsers: function (callback) {
      $http.get('/user/search').then(callback);
    },
    createGroup: function (data, callback) {
      $http.post('/group/new', data).then(callback);
    },
    getGroups: function (id, callback) {
      $http.get('/groups/' + id).then(callback);
    }
  }
}]);
