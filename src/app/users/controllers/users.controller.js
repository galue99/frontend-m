/**
 * Created by edgar on 14/11/16.
 */

(function() {
  'use strict';

  angular
    .module('charter')
    .controller('UsersController', UsersController);

  /** @ngInject */
  function UsersController($http, $log, $scope, SERVER, $uibModal, sweet, ngMessenger, userService, companyService, emailService) {

    var vm = this;

    $(".fakeloader").show();

    $scope.users = [];
    $scope.prueba = false;

    vm.allUsers = function(){
      userService.getUser()
        .then(function (response) {
          $scope.users = response.data.users;
          $(".fakeloader").fadeOut();
        }, function(error){
          $(".fakeloader").fadeOut();
        });
    };

    vm.allUsers();

    vm.allCompany = function(){
      companyService.getCompany()
        .then(function (response) {
          $scope.companys = response;
          $(".fakeloader").fadeOut();
        }, function(error){
          $(".fakeloader").fadeOut();
        });
    };

    vm.allCompany();


    $scope.open = function () {
      var modalInstance = $uibModal.open({
        animation: 'true',
        templateUrl: 'myModalContent.html',
        controller: 'UsersAddController',
        size: 'lg'
      });

      modalInstance.result.then(function (selectedItem) {
        vm.allUsers();
      }, function () {
      });
    };


    $scope.editUser = function (user) {
      var modalInstance = $uibModal.open({
        animation: $scope.animationsEnabled,
        templateUrl: 'myModalUserEdit.html',
        controller: 'UsersEditController',
        size: 'lg',
        resolve: {
          user: function () {
            return user;
          }
        }
      });

      modalInstance.result.then(function (selectedItem) {
        ngMessenger.displaySuccessMessage('Usuario Editado con Exito');
        vm.allUsers();
        //$scope.selected = selectedItem;
      }, function () {
        //$log.info('Modal dismissed at: ' + new Date());
      });
    };

    $scope.toggleAnimation = function () {
      $scope.animationsEnabled = !$scope.animationsEnabled;
    };


    $scope.deleteUser = function(user){
      sweet.show({
        title: 'Confirmar',
        text: 'Desea Eliminar este Usuario?',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#DD6B55',
        confirmButtonText: 'Si, Eliminar!',
        closeOnConfirm: false,
        closeOnCancel: false
      }, function(isConfirm) {
        if (isConfirm) {
          sweet.show('Eliminado!', 'El usuario ha sido eliminado.', 'success');

          userService.deleteUser(user)
            .then(function () {
              vm.allUsers();
              $(".fakeloader").show();
            }, function () {
              $(".fakeloader").fadeOut();
            });
        }else{
          sweet.show('Cancelar', 'Usuario no ha sido eliminado :)', 'error');
        }
      });
    };


    $scope.sendEmail = function(user){
      $(".fakeloader").show();
      emailService.sendEmail(user.id)
        .then(function(response){
          $(".fakeloader").fadeOut();
          ngMessenger.displaySuccessMessage('Credenciales enviadas con exito');
        }, function(error){
          $(".fakeloader").fadeOut();
        });
    }
  }
})();
