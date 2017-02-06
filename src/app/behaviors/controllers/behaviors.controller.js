/**
 * Created by edgar on 22/01/17.
 */

(function() {
  'use strict';

  angular
    .module('charter')
    .controller('BehaviorsController', BehaviorsController);

  /** @ngInject */
  function BehaviorsController($scope, $uibModal, sweet, ngMessenger, companyService, competitionsService, behaviorsService) {

    var vm = this;

    $(".fakeloader").show();
    vm.company_id = null;

    $scope.users = [];
    $scope.show = false;
    $scope.competitionsBehaviors = {};


    vm.allCompanys = function(){
      companyService.getCompany()
        .then(function (response) {
          $scope.companys = response;
          $(".fakeloader").fadeOut();
        }, function(error){
          $(".fakeloader").fadeOut();
        });
    };

    vm.allCompanys();

    vm.allCompetitions = function(id){
      vm.company_id = id;
      $(".fakeloader").show();
      competitionsService.getCompetitionsByIdCompany(id)
        .then(function (response) {
          $scope.competitions = response.data.competitions;
          $(".fakeloader").fadeOut();
        }, function(error){
          $(".fakeloader").fadeOut();
        });
    };

    $scope.open = function () {
      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'myModalContent.html',
        controller: 'BehaviorAddController',
        size: 'lg',
        resolve: {
          competition: function () {
            return $scope.competitionsBehaviors;
          }
        }
      });

      modalInstance.result.then(function (data) {
        $scope.competitionsBehaviors.behaviors.push(data);
        ngMessenger.displaySuccessMessage('Comportamiento Creada con Exito');
        $(".fakeloader").fadeOut();
      }, function () {
      });
    };


    $scope.mejorar = function () {
      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'myModalContentMejorar.html',
        controller: 'BehaviorMejorarController',
        size: 'lg',
        resolve: {
          competition: function () {
            return $scope.competitionsBehaviors;
          }
        }
      });

      modalInstance.result.then(function (id) {
        ngMessenger.displaySuccessMessage('Competencia Creada con Exito');
        $scope.showCompetition();
        vm.allCompetitions(vm.company_id);
      }, function () {
        $scope.showCompetition();
        vm.allCompetitions(vm.company_id);
      });
    };



    $scope.editBehavior = function (competition) {
      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'myModalUserEdit.html',
        controller: 'BehaviorEditController',
        size: 'lg',
        resolve: {
          competition: function () {
            return competition;
          }
        }
      });

      modalInstance.result.then(function () {
        ngMessenger.displaySuccessMessage('Comportamiento Editado con Exito');
        $scope.showCompetition();
        vm.allCompetitions(vm.company_id);
      }, function () {
        //$log.info('Modal dismissed at: ' + new Date());
      });
    };

    $scope.toggleAnimation = function () {
      $scope.animationsEnabled = !$scope.animationsEnabled;
    };


    $scope.deleteBehavior = function(behaviors){
      sweet.show({
        title: 'Confirmar',
        text: 'Desea Eliminar esta Competencia?',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#DD6B55',
        confirmButtonText: 'Si, Eliminar!',
        closeOnConfirm: false,
        closeOnCancel: false
      }, function(isConfirm) {
        if (isConfirm) {
          sweet.show('Eliminado!', 'La Competencia ha sido eliminado.', 'success');

          behaviorsService.deleteBehaviors(behaviors)
            .then(function () {
              $scope.showCompetition();
              vm.allCompetitions(vm.company_id);
              $(".fakeloader").show();
            }, function () {
              $(".fakeloader").fadeOut();
            });
        }else{
          sweet.show('Cancelar', 'Competencia no ha sido eliminado :)', 'error');
        }
      });
    };


    $scope.showCompetition = function(competition){
        $scope.competitionsBehaviors = competition;
        $scope.show = !$scope.show;
    }


  }
})();
