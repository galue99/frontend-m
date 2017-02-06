/**
 * Created by edgar on 22/01/17.
 */

(function() {
  'use strict';

  angular
    .module('charter')
    .controller('BehaviorMejorarController', BehaviorMejorarController);

  /** @ngInject */
  function BehaviorMejorarController($scope, $uibModalInstance, competition, competitionsService, ngMessenger, behaviorsService) {

    var vm = this;

    vm.allCompanys = function(){
      behaviorsService.competitionBehaviors()
        .then(function (response) {
          console.log(response);
          $scope.competitions = response.data.competitions;
          $(".fakeloader").fadeOut();
        });
    };

    vm.allCompanys();


    $scope.competitionsMejorar = function(competitions){
          console.log(competitions);
          $scope.behaviors = competitions;
          console.log($scope.behaviors);
    };

    $scope.agregarMejorar = function(behaviors){


      behaviors.competition_id = competition.id;
      behaviorsService.saveBehaviors(behaviors)
        .then(function () {
          ngMessenger.displaySuccessMessage('Competencia Agregada con Exito');
        }, function () {

        });
    };



    $scope.cancel = function () {
      $uibModalInstance.dismiss();
    };
  }
})();
