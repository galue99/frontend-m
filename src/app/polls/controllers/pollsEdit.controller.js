/**
 * Created by edgar on 18/01/17.
 */

(function() {
  'use strict';

  angular
    .module('charter')
    .controller('PollsEditController', PollsEditController);

  /** @ngInject */
  function PollsEditController($scope, $uibModalInstance, competition, competitionsService) {

    var vm = this;
    var token = localStorage.getItem("satellizer_token");
    console.log(competition);

    $scope.competition = competition;
    $scope.competition.type_id = parseInt(competition.type_id);


    competitionsService.getCompetitionsByType().then(function (data) {
      $scope.competitionsType = data.competitions;
    });


    $scope.ok = function (file) {

      $(".fakeloader").show();

      competitionsService.editCompetitions($scope.competition)
        .then(function () {
          $uibModalInstance.close($scope.competition.id);
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
