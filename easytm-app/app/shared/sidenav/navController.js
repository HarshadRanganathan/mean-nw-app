var module = angular.module('NavModule', [])
  .config(function ($mdThemingProvider) {
    $mdThemingProvider.theme('default')
      .primaryPalette('teal')
      .accentPalette('red');
  });

var gui = require('nw.gui');
var win = gui.Window.get();

module.controller('NavController', ['$scope', '$window', '$timeout', '$log', '$mdSidenav', '$mdDialog', '$q', 'NavService', function ($scope, $window, $timeout, $log, $mdSidenav, $mdDialog, $q, NavService) {

  $scope.userId = $window.sessionStorage.userId;

  /* SideNav Toggle functionalities */

  $scope.toggleLeft = buildDelayedToggler('left');

  /**
     * Supplies a function that will continue to operate until the
     * time is up.
     */
  function debounce(func, wait, context) {
    var timer;
    return function debounced() {
      var context = $scope,
        args = Array.prototype.slice.call(arguments);
      $timeout.cancel(timer);
      timer = $timeout(function () {
        timer = undefined;
        func.apply(context, args);
      }, wait || 10);
    };
  }
  /**
   * Build handler to open/close a SideNav; when animation finishes
   * report completion in console
   */
  function buildDelayedToggler(navID) {
    return debounce(function () {
      $mdSidenav(navID)
        .toggle()
        .then(function () {
          $log.debug("toggle " + navID + " is done");
        });
    }, 200);
  }

  $scope.minimiseWindow = function () {
    win.minimize();
  }

  // close Window
  $scope.closeWindow = function () {
    win.close();
  }

  /**
    Sidenav Content area
  **/

  /* model */
  $scope.groups = []

  $scope.init = function () {
    // get user groups from server
    NavService.getGroups($scope.userId, function (result) {
      var data = result['data'];
      $scope.groups = data;
    });
  };

  $scope.showNewGroupDialog = function (ev) {

    $mdDialog.show({
      locals: { groups: $scope.groups, userId: $scope.userId },
      templateUrl: 'app/views/groupForm.html',
      targetEvent: ev,
      controller: function GroupDialogController($scope, $mdDialog, $q, groups, userId) {

        /* model */
        $scope.group = {}
        $scope.group.users = [];
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

        /* To create a new group */
        $scope.createGroup = function (group) {
          group.userId = userId;
          NavService.createGroup(group, function (response) {
            $mdDialog.hide();
            groups.push(response['data']);
          })
        }

        /* async operation to get user details for autocomplete search functionality */
        function getUsers() {
          var q = $q.defer();
          NavService.getUsers(function (result) {
            q.resolve(result['data']);
          })
          return q.promise;
        }

      }
    })

  };

}]);
