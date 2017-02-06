/**
 * Created by edgar on 01/02/17.
 */


(function() {
  'use strict';

  angular
    .module('charter')
    .controller('PollShowController', PollShowController);

  /** @ngInject */
  function PollShowController($scope, $uibModalInstance, poll) {

    var vm = this;
    var token = localStorage.getItem("satellizer_token");


    $scope.poll = poll;

    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };
  }
})();
