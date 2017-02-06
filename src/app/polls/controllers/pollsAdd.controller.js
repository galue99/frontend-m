/**
 * Created by edgar on 18/01/17.
 */

(function() {
  'use strict';

  angular
    .module('charter')
    .controller('PollsAddController', PollsAddController);

  /** @ngInject */
  function PollsAddController($scope, $uibModalInstance, competitionsService, company ) {

    var vm = this;
    var token = localStorage.getItem("satellizer_token");

    competitionsService.getCompetitionsByType().then(function (data) {
      $scope.competitionsType = data.competitions;
    });



    $scope.ok = function () {

      $(".fakeloader").show();

      $scope.competition.company_id = company;
      console.log($scope.competition);
      competitionsService.saveQuestion($scope.competition)
        .then(function () {
          $uibModalInstance.close($scope.competition.company_id);
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
