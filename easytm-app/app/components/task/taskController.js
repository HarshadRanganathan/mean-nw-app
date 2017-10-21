var module = angular.module('TaskModule', []);

var nwNotify = require('node-notifier');

module.controller('TaskController', ['$scope', '$window', '$mdDialog', '$mdConstant', 'NotificationService', 'TaskService', function ($scope, $window, $mdDialog, $mdConstant, NotificationService, TaskService) {

  /* variables */
  $scope.task = {}; // dialog scope
  $scope.isTasksLoaded = false;
  $scope.userId = $window.sessionStorage.userId;
  $scope.userName = $window.sessionStorage.userName;

  $scope.init = function () {
    var msg = { userId: $scope.userId };

    // hook to notification service
    NotificationService.sendMessage('new connection', msg);
    NotificationService.getMessage('newTaskMsg', notifyTask);
    NotificationService.getMessage('completeTaskMsg', notifyTaskCompletion);

    getAllUserTasks();
  };

  //get user tasks from server
  function getAllUserTasks() {
    TaskService.userTasks($scope.userId, function (result) {
      var data = result['data'];
      $scope.user = data;

      checkForTasks();
      $scope.isTasksLoaded = true;
    });
  }

  // function to notify user
  function notifyTask(data) {
    nwNotify.notify({ title: 'Notification', text: data.assignerName + " assigned you task : " + data.taskName });
    // populate tasks
    getAllUserTasks();
  }

  function notifyTaskCompletion(data) {
    nwNotify.notify({ title: 'Notification', text: data.assigneeName + " completed task : " + data.taskName });
  }

  /* Filter */
  $scope.showCurrentTasks = function (task) {
    return task.taskStatus === 'CURRENT';
  }

  $scope.showOpenTasks = function (task) {
    return task.taskStatus != 'CURRENT' && task.taskStatus != 'COMPLETE';
  }

  /* Availability check */
  checkForTasks = function () {
    $scope.isTasksAvailable = false;
    $scope.isCurrentTaskAvailable = false;

    if (typeof $scope.user === 'undefined' || typeof $scope.user.tasks === 'undefined') {
      return false;
    };
    $scope.user.tasks.forEach(function (object, index, array) {
      if (object.taskStatus != 'CURRENT' && object.taskStatus != 'COMPLETE') {
        $scope.isTasksAvailable = true;
      }
      if (object.taskStatus === 'CURRENT') {
        $scope.isCurrentTaskAvailable = true;
      }
    })
  }

  $scope.showNewTaskDialog = function (ev) {
    $mdDialog.show({
      locals: { user: $scope.user, userId: $scope.userId, userName: $scope.userName },
      templateUrl: 'app/views/taskForm.html',
      targetEvent: ev,
      controller: function DialogController($scope, $mdDialog, $mdConstant, user, userId, userName) {

        $scope.task = {}
        $scope.task.labels = [];
        $scope.keys = [$mdConstant.KEY_CODE.SPACE, $mdConstant.KEY_CODE.ENTER];

        $scope.closeDialog = function () {
          $mdDialog.hide();
        }

        $scope.createTask = function (task) {
          task.userId = userId;
          task.userName = userName;
          task.assigneeId = userId;
          task.status = 'NEW';

          TaskService.addTask(task, function (response) {
            $mdDialog.hide();
            /* add task to global scope */
            user.tasks.push(response['data']);
            checkForTasks();
          })
        }
      }
    })
  };

  /* on current update existing data in db and model */
  $scope.current = function (task) {
    TaskService.currentTask(task._id, function (response) {
      $scope.user.tasks.some(function (object, index, array) {
        if (object._id === task._id) {
          $scope.user.tasks[index] = response['data'];
          checkForTasks();
          return true;
        }
      })
    })
  }

  /* on hold update existing data in db and model */
  $scope.hold = function (task) {
    TaskService.holdTask(task._id, function (response) {
      $scope.user.tasks.some(function (object, index, array) {
        if (object._id === task._id) {
          $scope.user.tasks[index] = response['data'];
          checkForTasks();
          return true;
        }
      })
    })
  }

  /* remove tasks which are completed */
  $scope.complete = function (task) {
    TaskService.completeTask(task._id, function (response) {
      $scope.user.tasks.some(function (object, index, array) {
        if (object._id === task._id) {
          $scope.user.tasks.splice(index, 1);
          checkForTasks();

          if ($scope.userId != task.assignerId) {
            // send notification to assigner
            var msg = {
              assigneeName: $scope.userName,
              assignerId: task.assignerId,
              taskName: task.taskName
            }
            NotificationService.sendMessage('complete task', msg);
          }

          return true;
        }
      })
    })
  }

}]);
