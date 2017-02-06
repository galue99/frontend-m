/**
 * Created by edgar on 29/01/17.
 */
(function() {
  'use strict';

  angular
    .module('charter')
    .controller('EvaluadoresListController', EvaluadoresListController);

  /** @ngInject */
  function EvaluadoresListController($scope, sweet, $uibModalInstance, user, evaluadores, competitionsService, pollsService, ngMessenger) {

    var vm = this;
    var token = localStorage.getItem("satellizer_token");

    $scope.userList = [];

    for(var data in evaluadores){

      if(user.id == evaluadores[data].user_id){
        $scope.userList.push(evaluadores[data]);
      }
    }


    $scope.deleteEvaluador = function(evaluador){

      sweet.show({
        title: 'Confirmar',
        text: 'Desea Eliminar este Evalaudor',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#DD6B55',
        confirmButtonText: 'Si, Eliminar!',
        closeOnConfirm: false,
        closeOnCancel: false
      }, function(isConfirm) {
        if (isConfirm) {
          sweet.show('Eliminado!', 'El Evaluador ha sido eliminado.', 'success');

          pollsService.deleteUserAssign(evaluador)
            .then(function(response){
              var index = $scope.userList.indexOf(evaluador);
              $scope.userList.splice(index, 1);
              ngMessenger.displaySuccessMessage('Eliminado correctamente');
            })
        }else{
          sweet.show('Cancelar', 'El Evaluador no ha sido eliminado :)', 'error');
        }
      });


    };


    $scope.evaluadores = evaluadores;

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
