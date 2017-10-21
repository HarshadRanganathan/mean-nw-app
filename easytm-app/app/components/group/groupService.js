var module = angular.module('GroupModule');

module.factory('GroupService', ['$http', function ($http) {
  return {
    getGroupUserTasks: function (id, callback) {
      $http.get('/group/' + id).then(callback);
    },
    deleteGroup: function (id, callback) {
      $http.post('/group/' + id + '/delete').then(callback);
    },
    getUsers: function (callback) {
      $http.get('/user/search').then(callback);
    },
    addUsers: function (data, callback) {
      $http.post('/group/add', data).then(callback);
    }
  }
}]);
