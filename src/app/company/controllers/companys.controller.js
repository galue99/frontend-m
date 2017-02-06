/**
 * Created by edgar on 14/11/16.
 */

(function() {
  'use strict';

  angular
    .module('charter')
    .controller('CompanyController', CompanyController);

  /** @ngInject */
  function CompanyController($http, $log, $scope, IMAGE, $uibModal, sweet, ngMessenger, companyService) {

    var vm = this;

    $scope.users = [];
    $scope.prueba = false;

    $scope.SERVER = IMAGE;

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


    $scope.open = function () {
      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'myModalContent.html',
        controller: 'CompanyAddController',
        size: 'lg'
      });

      modalInstance.result.then(function () {
        vm.allCompanys();
        ngMessenger.displaySuccessMessage('Empresa Creada con Exito');
      }, function () {
      });
    };


    $scope.editCompany = function (company) {
      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'myModalUserEdit.html',
        controller: 'CompanyEditController',
        size: 'lg',
        resolve: {
          company: function () {
            return company;
          }
        }
      });

      modalInstance.result.then(function () {
        vm.allCompanys();
        ngMessenger.displaySuccessMessage('Empresa Editada con Exito');
        //$scope.selected = selectedItem;
      }, function () {
        //$log.info('Modal dismissed at: ' + new Date());
      });
    };

    $scope.toggleAnimation = function () {
      $scope.animationsEnabled = !$scope.animationsEnabled;
    };


    $scope.deleteCompany = function(company){

      sweet.show({
        title: 'Confirmar',
        text: 'Desea Eliminar esta Empresa?',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#DD6B55',
        confirmButtonText: 'Si, Eliminar!',
        closeOnConfirm: false,
        closeOnCancel: false
      }, function(isConfirm) {
        if (isConfirm) {
          $(".fakeloader").show();
          sweet.show('Eliminado!', 'La Empresa ha sido eliminado.', 'success');

          companyService.deleteCompany(company)
            .then(function () {
              vm.allCompanys();

            }, function (err) {
              ngMessenger.displayErrorMessage(err.data.message);
              $(".fakeloader").fadeOut();
            });
        }else{
          sweet.show('Cancelar', 'Empresa no ha sido eliminado :)', 'error');
        }
      });
    };


  }
})();
