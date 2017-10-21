var module = angular.module('TaskModule');

module.factory('TaskService', ['$http', function ($http) {
  return {
    userTasks: function (id, callback) {
      $http.get('/user/' + id).then(callback);
    },
    addTask: function (data, callback) {
      $http.post('/task/new', data).then(callback);
    },
    currentTask: function (id, callback) {
      $http.post('/task/' + id + '/current').then(callback);
    },
    holdTask: function (id, callback) {
      $http.post('/task/' + id + '/hold').then(callback);
    },
    completeTask: function (id, callback) {
      $http.post('/task/' + id + '/complete').then(callback);
    }
  }
}]);
