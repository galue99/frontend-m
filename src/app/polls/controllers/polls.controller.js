/**
 * Created by edgar on 22/01/17.
 */

(function() {
  'use strict';

  angular
    .module('charter')
    .controller('PollsController', PollsController);

  /** @ngInject */
  function PollsController($auth, $scope, $uibModal, sweet, ngMessenger, pollsService, competitionsService, ReportService) {

    var vm = this;

    $scope.show = true;

    $(".fakeloader").show();

    vm.allPolls = function(){
      pollsService.getPolls()
        .then(function (response) {
          $scope.polls = response.data;
          $(".fakeloader").fadeOut();
        }, function(error){
          $(".fakeloader").fadeOut();
        });
    };

    vm.allPolls();

    vm.allCompetitions = function(id){
      vm.company_id = id;
      competitionsService.getCompetitionsById(id)
        .then(function (response) {
          $scope.competitions = response.competitions;
          $(".fakeloader").fadeOut();
        }, function(error){
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
        ngMessenger.displaySuccessMessage('Competencia Creada con Exito');
        vm.allCompetitions(id);
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


    $scope.addQuestion = function (poll) {
      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'myModalCreateQuestion.html',
        controller: 'QuestionAddController',
        size: 'lg',
        resolve: {
          poll: function () {
            return poll;
          }
        }
      });

      modalInstance.result.then(function (id) {
        ngMessenger.displaySuccessMessage('Competencia Creada con Exito');
        vm.allCompetitions(id);
      }, function () {
      });
    };


    $scope.deletePoll = function(poll){
      sweet.show({
        title: 'Confirmar',
        text: 'Desea Eliminar esta Encuesta?',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#DD6B55',
        confirmButtonText: 'Si, Eliminar!',
        closeOnConfirm: false,
        closeOnCancel: false
      }, function(isConfirm) {
        if (isConfirm) {
          sweet.show('Eliminado!', 'La Encuesta ha sido eliminado.', 'success');

          pollsService.deletePoll(poll)
            .then(function () {
              vm.allPolls();
              $(".fakeloader").show();
            }, function () {
              $(".fakeloader").fadeOut();
            });
        }else{
          sweet.show('Cancelar', 'La Encuesta no ha sido eliminado :)', 'error');
        }
      });
    };


    $scope.addAssign = function(poll){
      $scope.poll = poll;
      $scope.show = !$scope.show;
      pollsService.pollByUser(poll.id)
        .then(function(response){
          $scope.users = response.data.Evaluado;
          $scope.users.evaluadores = response.data.Evaluadores;
        }, function(err){
          $(".fakeloader").fadeOut();
        });
    };


    $scope.openModalEvaluadores = function(user, evaluadores){

      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'myModalEvaluadores.html',
        controller: 'EvaluadoresListController',
        size: 'lg',
        resolve: {
          user: function () {
            return user;
          },
          evaluadores: function () {
            return evaluadores;
          }
        }
      });

      modalInstance.result.then(function (id) {
        }, function () {
      });

    };


    $scope.addEvaluadores = function(poll){

      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'myModalAddEvaluadores.html',
        controller: 'AddEvaluadoresController',
        size: 'lg',
        resolve: {
          poll: function () {
            return poll;
          }
        }

      });

      modalInstance.result.then(function (id) {
        $(".fakeloader").show();
        pollsService.pollByUser($scope.poll.id)
          .then(function(response){
            $(".fakeloader").fadeOut();
            $scope.users = response.data.Evaluado;
            $scope.users.evaluadores = response.data.Evaluadores;
          })
      }, function () {
        $(".fakeloader").show();
        pollsService.pollByUser($scope.poll.id)
          .then(function(response){
            $(".fakeloader").fadeOut();
            $scope.users = response.data.Evaluado;
            $scope.users.evaluadores = response.data.Evaluadores;
          }, function(err){
            $(".fakeloader").fadeOut();
          });
      });

    };


    $scope.openModalPoll= function(poll){

      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'myModalPoll.html',
        controller: 'PollShowController',
        size: 'lg',
        resolve: {
          poll: function () {
            return poll;
          }
        }
      });

      modalInstance.result.then(function (id) {
      }, function () {
      });

    };

    $scope.showPoll = function(poll){
      $(".fakeloader").show();
      pollsService.getIdPolls(poll.id)
        .then(function(response){
          console.log(response.data);
          $(".fakeloader").fadeOut();
          $scope.openModalPoll(response.data);
        });

    };




    $scope.deleteUser = function(user){
      $(".fakeloader").show();
      pollsService.deleteUser(user)
        .then(function(response){
          ngMessenger.displaySuccessMessage('Usuario Eliminado con Exito');
          pollsService.pollByUser($scope.poll.id)
            .then(function(response){
              $(".fakeloader").fadeOut();
              $scope.users = response.data.Evaluado;
              $scope.users.evaluadores = response.data.Evaluadores;
            }, function(err){
              $(".fakeloader").fadeOut();
            });
        });
    };


    $scope.printReport = function(data, encuesta_id){

      window.open(
        'http://api.mejorar-se.com.ve/api/printReport/' + data.id +'/' + encuesta_id +'?token='+ $auth.getToken(),
        '_blank' // <- This is what makes it open in a new window.
      );

    //  window.location.href = 'http://api.mejorar-se.com.ve/api/printReport/' + data.id +'/' + encuesta_id +'?token='+ $auth.getToken(), '_blank';

  /*    ReportService.printReport(data.id, encuesta_id)
        .then(function(response){
         var anchor = angular.element('<a/>');
          anchor.attr({
            href: 'data:attachment/pdf;charset=utf-8,' + encodeURI(response.data),
            target: '_blank',
            download: 'informe_para_el_gerente.pdf'
          })[0].click();
        }, function(err){
          $(".fakeloader").fadeOut();
        });*/
    };


    $scope.printReport1 = function(data, encuesta_id){

      window.open(
        'http://api.mejorar-se.com.ve/api/printReport1/' + data.id +'/' + encuesta_id +'?token='+ $auth.getToken(),
        '_blank' // <- This is what makes it open in a new window.
      );
      //0window.location.href = 'http://api.mejorar-se.com.ve/api/printReport1/' + data.id +'/' + encuesta_id +'?token='+ $auth.getToken(), '_blank';

      /* ReportService.printReport1(data.id, encuesta_id)
         .then(function(response){
           var anchor = angular.element('<a/>');
           anchor.attr({
             href: 'data:attachment/pdf;charset=utf-8,' + encodeURI(response.data),
             target: '_blank',
             download: 'informe_general.pdf'
           })[0].click();
         }, function(err){
           $(".fakeloader").fadeOut();
         });*/

    }





  }
})();
