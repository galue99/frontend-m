/**
 * Created by edgar on 22/01/17.
 */

(function() {
  'use strict';

  angular
    .module('charter')
    .controller('CompetitionMejorarController', CompetitionMejorarController);

  /** @ngInject */
  function CompetitionMejorarController($scope, $uibModalInstance, company, competitionsService, ngMessenger, pollsService) {

    competitionsService.getMejorarCompetitions()
      .then(function (response){
        $scope.CompetitionsMejorar = response.data.competitions;
      });


    $scope.agregarMejorar = function(competition){

      competition.company_id = company;

      competitionsService.saveCompetitions(competition)
        .then(function () {
          ngMessenger.displaySuccessMessage('Competencia Agregada con Exito');
        }, function () {

        });
    };

    $scope.createPollMejorar = function(){
      $(".fakeloader").show();
      $scope.competition.name;
      competitionsService.getCompetitionsByIdCompany(company)
        .then(function (response) {
          response.data.name = $scope.competition.name;
          pollsService.savePoll(response.data)
            .then(function(result){

              $uibModalInstance.close(company.id);
            })
        }, function () {
          $(".fakeloader").fadeOut();
        });
    };





    $scope.cancel = function () {
      $uibModalInstance.dismiss(company);
    };
  }
})();
