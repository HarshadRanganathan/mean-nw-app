var module = angular.module('easyTMApp');

/* npm install --save ldapjs */
// var ldap = require('ldapjs');
var path = require('path');

/* Creates LDAP client
Provide your company's LDAP url
*/
// var client = ldap.createClient({
//   url: '' 
// });

var domainName = '@test.com' /* Update your company's domain name */
var userPrincipalName = ''; /* Update the principal name */

var base = ''; /* Update your company's ldap base */

/* update LDAP options as required */
var opts = {
  filter: '(&(objectCategory=person)(objectClass=user)(sAMAccountName=))',
  scope: 'sub',
  attributes: ['cn', 'mail', 'thumbnailPhoto']
}

module.controller('LoginController', ['$scope', '$q', '$window', '$location', 'LoginService', 'AuthService', function ($scope, $q, $window, $location, LoginService, AuthService) {

  $scope.user = {};
  $scope.userObject = { 'cn': 'TestUser', 'mail': 'TestUser@gmail.com' }; // should be empty if using LDAP auth
  $scope.isLoginStarted = false;
  $scope.progressStep = 0;

  $scope.login = function () {
    $scope.isLoginStarted = true;

    /* LDAP authentication is disabled. 
    Update the ldap client details and then uncomment this step
    */

    // ldapAuthentication()
    //   .then(function () {
    //     return getAuthorization(userId);
    //   })
    getAuthorization($scope.user.id)
      .then(function (userId) {
        return createUser(userId);
      })
      .then(function () {
        goToTaskPage();
      })
      .catch(function (reason) {
        if (reason == "Authentication failed") {
          $scope.isLoginStarted = false;
          $scope.progressStep = 0;
          $scope.loginError = true;
          $location.path("/");
        }
      })
  }

  /**
  * Authenticate user credentials with ldap server and fetch details
  */
  var ldapAuthentication = function () {
    $scope.progressStep++;

    var deferred = $q.defer();
    // authenticate user
    client.bind(userPrincipalName, $scope.user.password, function (err) {
      if (err) {
        // authentication failed
        console.log(JSON.stringify(err));
        return deferred.reject('Authentication failed');
      } else {
        $scope.progressStep++;
        // get user details from LDAP
        client.search(base, opts, function (err, res) {
          res.on('searchEntry', function (entry) {
            $scope.userObject = entry.object;
            deferred.resolve();
          })
        })
      }
    })
    return deferred.promise;
  }

  /**
  * get authorization token from server
  */
  var getAuthorization = function (userId) {
    var msg = { userId: userId };
    var deferred = $q.defer();
    AuthService.getToken(msg, function (response) {
      var authResponse = response['data'];
      if (authResponse.success) {
        $window.sessionStorage['token'] = authResponse.token;
        $window.sessionStorage['userId'] = userId;
        $window.sessionStorage['userName'] = $scope.userObject.cn;
        deferred.resolve(userId);
      }
    })
    return deferred.promise;
  }

  /**
  * if new user, add details
  */
  var createUser = function (userId) {
    $scope.progressStep++;

    var deferred = $q.defer();
    LoginService.checkUser(userId, function (response) {
      if (response['data'].success) {
        deferred.resolve();
      } else {
        // create user
        var name = $scope.userObject.cn;
        var email = $scope.userObject.mail;

        var userData = { userId: userId, name: name, email: email };
        LoginService.createUser(userData, function (response) {
          deferred.resolve();
        })
      }
    });
    return deferred.promise;
  }

  function goToTaskPage() {
    $location.path("/task");
  }

}])
