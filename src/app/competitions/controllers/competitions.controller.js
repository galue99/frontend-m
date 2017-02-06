/**
 * Created by edgar on 22/01/17.
 */

(function() {
  'use strict';

  angular
    .module('charter')
    .controller('CompetitionsController', CompetitionsController);

  /** @ngInject */
  function CompetitionsController($http, $log, $scope, SERVER, $uibModal, sweet, ngMessenger, companyService, competitionsService) {

    var vm = this;

    vm.company_id = null;

    $scope.users = [];
    $scope.prueba = false;
    $(".fakeloader").show();

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
      competitionsService.getCompetitionsById(id)
        .then(function (response) {
          $scope.competitions = response.competitions;
          $(".fakeloader").fadeOut();
        });
    };

    $scope.open = function () {
      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'myModalContent.html',
        controller: 'CompetitionAddController',
        size: 'lg',
        resolve: {
          company: function () {
            return vm.company_id;
          }
        }
      });

      modalInstance.result.then(function (id) {
        ngMessenger.displaySuccessMessage('Competencia Creada con Exito');
        vm.allCompetitions(id);
      }, function () {
      });
    };


    $scope.mejorar = function () {
      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'myModalContentMejorar.html',
        controller: 'CompetitionMejorarController',
        size: 'lg',
        resolve: {
          company: function () {
            return vm.company_id;
          }
        }
      });

      modalInstance.result.then(function (id) {
        ngMessenger.displaySuccessMessage('Competencia Creada con Exito');
        vm.allCompetitions(id);
      }, function () {

        vm.allCompetitions(vm.company_id);
      });
    };

    $scope.createPoll = function () {
      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'myModalCreatePoll.html',
        controller: 'CompetitionMejorarController',
        size: 'lg',
        resolve: {
          company: function () {
            return vm.company_id;
          }
        }
      });

      modalInstance.result.then(function (id) {
        ngMessenger.displaySuccessMessage('Evaluacion Creada con Exito');
        vm.allCompetitions(vm.company_id);
      }, function () {

        vm.allCompetitions(vm.company_id);
      });
    };


    $scope.editCompetition = function (competition) {
      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'myModalUserEdit.html',
        controller: 'CompetitionEditController',
        size: 'lg',
        resolve: {
          competition: function () {
            return competition;
          }
        }
      });

      modalInstance.result.then(function (id) {
        ngMessenger.displaySuccessMessage('Competencia Editada con Exito');
        vm.allCompetitions(id);
      }, function () {
        //$log.info('Modal dismissed at: ' + new Date());
      });
    };

    $scope.toggleAnimation = function () {
      $scope.animationsEnabled = !$scope.animationsEnabled;
    };


    $scope.deleteCompetition = function(competition){
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

          competitionsService.deletecompetitions(competition)
            .then(function () {
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


  }
})();
