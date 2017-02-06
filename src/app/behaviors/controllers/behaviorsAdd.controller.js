/**
 * Created by edgar on 18/01/17.
 */

(function() {
  'use strict';

  angular
    .module('charter')
    .controller('BehaviorAddController', BehaviorAddController);

  /** @ngInject */
  function BehaviorAddController($scope, $uibModalInstance, behaviorsService, competition ) {

    $scope.ok = function () {

      $(".fakeloader").show();

      $scope.behavior.competition_id = competition.id;

      behaviorsService.saveBehaviors($scope.behavior)
        .then(function (response) {
          $uibModalInstance.close(response.data.Behavior);
          //$(".fakeloader").show();
        }, function () {
          $(".fakeloader").fadeOut();
        });
    };

    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };
  }
})();
