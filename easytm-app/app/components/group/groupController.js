var module = angular.module('GroupModule', []);

module.directive('userAvatar', function () {
  return {
    replace: true,
    template: '<svg class="user-avatar" viewBox="0 0 128 128" height="42" width="42" pointer-events="none" display="block" > <path fill="#009688" d="M0 0h128v128H0z"/> <path fill="#FFE0B2" d="M36.3 94.8c6.4 7.3 16.2 12.1 27.3 12.4 10.7-.3 20.3-4.7 26.7-11.6l.2.1c-17-13.3-12.9-23.4-8.5-28.6 1.3-1.2 2.8-2.5 4.4-3.9l13.1-11c1.5-1.2 2.6-3 2.9-5.1.6-4.4-2.5-8.4-6.9-9.1-1.5-.2-3 0-4.3.6-.3-1.3-.4-2.7-1.6-3.5-1.4-.9-2.8-1.7-4.2-2.5-7.1-3.9-14.9-6.6-23-7.9-5.4-.9-11-1.2-16.1.7-3.3 1.2-6.1 3.2-8.7 5.6-1.3 1.2-2.5 2.4-3.7 3.7l-1.8 1.9c-.3.3-.5.6-.8.8-.1.1-.2 0-.4.2.1.2.1.5.1.6-1-.3-2.1-.4-3.2-.2-4.4.6-7.5 4.7-6.9 9.1.3 2.1 1.3 3.8 2.8 5.1l11 9.3c1.8 1.5 3.3 3.8 4.6 5.7 1.5 2.3 2.8 4.9 3.5 7.6 1.7 6.8-.8 13.4-5.4 18.4-.5.6-1.1 1-1.4 1.7-.2.6-.4 1.3-.6 2-.4 1.5-.5 3.1-.3 4.6.4 3.1 1.8 6.1 4.1 8.2 3.3 3 8 4 12.4 4.5 5.2.6 10.5.7 15.7.2 4.5-.4 9.1-1.2 13-3.4 5.6-3.1 9.6-8.9 10.5-15.2M76.4 46c.9 0 1.6.7 1.6 1.6 0 .9-.7 1.6-1.6 1.6-.9 0-1.6-.7-1.6-1.6-.1-.9.7-1.6 1.6-1.6zm-25.7 0c.9 0 1.6.7 1.6 1.6 0 .9-.7 1.6-1.6 1.6-.9 0-1.6-.7-1.6-1.6-.1-.9.7-1.6 1.6-1.6z"/> <path fill="#E0F7FA" d="M105.3 106.1c-.9-1.3-1.3-1.9-1.3-1.9l-.2-.3c-.6-.9-1.2-1.7-1.9-2.4-3.2-3.5-7.3-5.4-11.4-5.7 0 0 .1 0 .1.1l-.2-.1c-6.4 6.9-16 11.3-26.7 11.6-11.2-.3-21.1-5.1-27.5-12.6-.1.2-.2.4-.2.5-3.1.9-6 2.7-8.4 5.4l-.2.2s-.5.6-1.5 1.7c-.9 1.1-2.2 2.6-3.7 4.5-3.1 3.9-7.2 9.5-11.7 16.6-.9 1.4-1.7 2.8-2.6 4.3h109.6c-3.4-7.1-6.5-12.8-8.9-16.9-1.5-2.2-2.6-3.8-3.3-5z"/> <circle fill="#444" cx="76.3" cy="47.5" r="2"/> <circle fill="#444" cx="50.7" cy="47.6" r="2"/> <path fill="#444" d="M48.1 27.4c4.5 5.9 15.5 12.1 42.4 8.4-2.2-6.9-6.8-12.6-12.6-16.4C95.1 20.9 92 10 92 10c-1.4 5.5-11.1 4.4-11.1 4.4H62.1c-1.7-.1-3.4 0-5.2.3-12.8 1.8-22.6 11.1-25.7 22.9 10.6-1.9 15.3-7.6 16.9-10.2z"/> </svg>'
  };
});

module.controller('GroupController', ['$scope', '$rootScope', '$window', '$routeParams', '$mdDialog', '$mdBottomSheet', '$mdToast', '$mdConstant', 'GroupService', 'TaskService', 'NotificationService', function ($scope, $rootScope, $window, $routeParams, $mdDialog, $mdBottomSheet, $mdToast, $mdConstant, GroupService, TaskService, NotificationService) {

  $scope.total = 0;
  $scope.new = 0;
  $scope.current = 0;
  $scope.hold = 0;
  $scope.isGroupLoaded = false;
  $scope.userId = $window.sessionStorage.userId;
  $scope.userName = $window.sessionStorage.userName;

  $rootScope.$on("InitGroup", function () {
    $scope.init();
  });

  $scope.init = function () {
    // get user tasks from server
    GroupService.getGroupUserTasks($routeParams.groupId, function (result) {
      var data = result['data'].users;
      $scope.users = data;
      $scope.selectUser(0);
      $scope.isGroupLoaded = true;
    });
  };

  $scope.showGroupTaskDialog = function (ev) {
    $mdDialog.show({
      locals: { users: $scope.users, selectedUser: $scope.selectedUser, userId: $scope.userId, userName: $scope.userName },
      templateUrl: 'app/views/taskForm.html',
      targetEvent: ev,
      controller: function DialogController($scope, $mdDialog, $mdConstant, users, selectedUser, userId, userName) {

        $scope.task = {}
        $scope.task.labels = [];
        $scope.keys = [$mdConstant.KEY_CODE.SPACE, $mdConstant.KEY_CODE.ENTER];
        $scope.assigneeId = users[selectedUser].userId;

        $scope.closeDialog = function () {
          $mdDialog.hide();
        }

        $scope.createTask = function (task) {
          /* set static data */
          task.userId = userId;
          task.userName = userName;
          task.assigneeId = $scope.assigneeId; // assign task to selected user
          task.status = 'NEW';

          TaskService.addTask(task, function (response) {
            $mdDialog.hide();

            /* notify user */
            var msg = {
              assignerName: userName,
              assigneeId: $scope.assigneeId,
              taskName: task.taskName
            }
            NotificationService.sendMessage('new task', msg);

            /* add task to global scope */
            users[selectedUser].tasks.push(response['data']);
            calculateTasksData(users[selectedUser].tasks);
          })
        }
      }
    })
  };

  $scope.showGridBottomSheet = function () {
    $scope.alert = '';
    $mdBottomSheet.show({
      locals: { groupId: $routeParams.groupId },
      templateUrl: 'app/views/groupOptions.html',
      controller: 'GridBottomSheetCtrl'
    }).then(function (clickedItem) {

    });
  };

  // display tasks of selected user
  $scope.selectUser = function (index) {
    $scope.selectedUser = index;
    $scope.tasks = $scope.users[index].tasks;
    calculateTasksData($scope.tasks)
  }

  function calculateTasksData(tasks) {
    // reset data
    $scope.total = 0;
    $scope.current = 0;
    $scope.hold = 0;
    $scope.new = 0;

    $scope.total = tasks.length;
    tasks.forEach(function (element, index, array) {
      if (element.taskStatus == 'CURRENT') {
        $scope.current++;
      }
      else if (element.taskStatus == 'HOLD') {
        $scope.hold++;
      }
      else if (element.taskStatus == 'NEW') {
        $scope.new++;
      }
    })
  }

}])

module.controller('GridBottomSheetCtrl', function ($scope, $rootScope, $q, $location, $mdDialog, $mdToast, $mdBottomSheet, groupId, GroupService) {

  var grpDelSuccess = "Group Deleted";

  /* group options */
  $scope.items = [
    { id: 'addUsersToGrp', name: 'Add Members', icon: 'add_circle' },
    { id: 'deleteGrp', name: 'Delete Group', icon: 'delete' }
  ];

  $scope.listItemClick = function ($index) {
    var clickedItem = $scope.items[$index];
    $mdBottomSheet.hide(clickedItem);
    if (clickedItem.id == "deleteGrp") {
      deleteGrp();
    } else if (clickedItem.id == "addUsersToGrp") {
      addUsersToGrp();
    }
  };

  function deleteGrp() {
    var confirm = $mdDialog.confirm()
      .title('Delete Group')
      .textContent('Are you sure you want to delete the group ?')
      .ok('Delete')
      .cancel('Cancel');

    $mdDialog.show(confirm).then(function () {
      GroupService.deleteGroup(groupId, function (result) {
        var data = result['data'];
        if (data == grpDelSuccess) {
          showMessage("Group has been sucessfully deleted");
          $location.path("/task");
        }
      });
    });
  }

  function addUsersToGrp() {

    $mdDialog.show({
      locals: { groupId: groupId },
      templateUrl: 'app/views/addUsersForm.html',
      controller: function AddUsersDialogController($scope, $rootScope, $mdDialog, $q, groupId) {
        /* model */
        $scope.users = [];
        $scope.listOfUsers = getUsers();

        $scope.closeDialog = function () {
          $mdDialog.hide();
        }

        /* filter autocomplete list based on query */
        $scope.querySearch = function (query) {
          return $scope.listOfUsers.then(function (result) {
            return result.filter(function (user) {
              var lowercaseQuery = angular.lowercase(query);
              var lowercaseData = angular.lowercase(user.email);
              return (lowercaseData.indexOf(lowercaseQuery) === 0);
            });
          });
        }

        /* To add new users to group */
        $scope.addNewUsersToGroup = function (users) {
          var group = {};
          group.groupId = groupId;
          group.users = users;

          /* add users and update group with details */
          addUsers(group)
            .then(function () {
              updateGroupPage();
            });
        }

        /* add the users to the group */
        function addUsers(group) {
          var deferred = $q.defer();
          GroupService.addUsers(group, function (response) {
            $mdDialog.hide();
            deferred.resolve();
          });
          return deferred.promise;
        }

        /* initialise group with new users task details */
        function updateGroupPage() {
          showMessage("Users have been added to the group");
          $rootScope.$emit("InitGroup", {});
        }

        /* async operation to get user details for autocomplete search functionality */
        function getUsers() {
          var q = $q.defer();
          GroupService.getUsers(function (result) {
            q.resolve(result['data']);
          })
          return q.promise;
        }
      }
    });
  }

  /* show toast messages */
  function showMessage(message) {
    $mdToast.show(
      $mdToast.simple()
        .textContent(message)
        .position('top right')
        .hideDelay(1500)
    );
  }

});
