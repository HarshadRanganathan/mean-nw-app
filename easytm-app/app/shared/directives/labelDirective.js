var module = angular.module('DirectiveModule', ['TaskModule', 'GroupModule']);

module.directive('taskLabels', function () {
  return {
    restrict: 'A',
    scope: {
      labels: '=',
      priority: '='
    },
    template:
    '<ng-md-icon icon="local_offer" style="fill: #8A8A8A;" size="14"></ng-md-icon>' +
    '<span ng-repeat="label in labels" class="label"> ' +
    '{{label | uppercase}}' +
    '</span>' +
    '<span ng-if="priority" class="label">PRIORITY</span>'
  }
})
