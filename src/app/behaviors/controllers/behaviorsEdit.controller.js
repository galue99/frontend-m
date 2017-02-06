/**
 * Created by edgar on 18/01/17.
 */

(function() {
  'use strict';

  angular
    .module('charter')
    .controller('BehaviorEditController', BehaviorEditController);

  /** @ngInject */
  function BehaviorEditController($scope, $uibModalInstance, competition, behaviorsService) {

    var vm = this;
    var token = localStorage.getItem("satellizer_token");

    $scope.behavior = competition;

    $scope.ok = function (file) {

      $(".fakeloader").show();

      behaviorsService.editBehaviors($scope.behavior)
        .then(function () {
          $uibModalInstance.close($scope.behavior.id);
          $(".fakeloader").show();
        }, function () {
          $(".fakeloader").fadeOut();
        });
    };


    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };
  }
})();
