var module = angular.module('NotificationModule', []);

module.factory('NotificationService', ['API_END_POINT', function (API_END_POINT) {

  var socket = io.connect(API_END_POINT, { transports: ['polling'] });

  var getMessage = function (event, callback) {
    socket.on(event, function (data) {
      callback(data);
    })
  }

  var sendMessage = function (event, data) {
    socket.emit(event, data);
  }

  return {
    getMessage: getMessage,
    sendMessage: sendMessage
  }
}])
