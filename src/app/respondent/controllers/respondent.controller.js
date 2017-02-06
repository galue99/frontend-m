/**
 * Created by edgar on 24/11/16.
 */

(function() {
  'use strict';

  angular
    .module('charter')
    .controller('RespondentController', RespondentController);

  /** @ngInject */
  function RespondentController($scope, $auth, $state, $timeout, $sessionStorage, pollsService, $uibModal, ngMessenger, sweet) {

    var vm = this;
    var token = localStorage.getItem("satellizer_token");

    $scope.show1 = false;
    $scope.show2 = true;
    $scope.show3 = false;
    $scope.showButton = true;
    $scope.poll = {};
    $scope.dataAnswers = [];
    $scope.poll_id = null;
    $scope.item = null;
    var i = 0;
    var itemLength = 0;
    var item = 1;
    var lengthPhrases = 0;
    $scope.countItems = 1;
    $scope.countPhrases = 1;

    //$(".fakeloader").show();


    //Datos del Usuario Logueado
    $scope.user = $sessionStorage.user;
    //fin

    $scope.startEvaluation = function(){
      $scope.show1 = !$scope.show1;
      $scope.show2 = !$scope.show2;
      itemLength = $scope.poll.items.length;
      $scope.item = $scope.poll.items[0];
      $scope.phrases = $scope.item.phrases[0];
      lengthPhrases = $scope.item.phrases.length;
    };

    $scope.nextQuestion = function(){
      $scope.showButton = true;
        i++;

          if(lengthPhrases > i){
            $scope.countPhrases = i+1;
            $scope.phrases = $scope.item.phrases[i];
            $scope.question.answer = false;


          }else{
            i = 0;
            $scope.countPhrases = i+1;
            if(itemLength > item){
              $scope.item = $scope.poll.items[item];
              $scope.phrases = $scope.item.phrases[i];
              lengthPhrases = $scope.poll.items[item].phrases.length;
              item++;
              $scope.countItems = item;
              $scope.question.answer = false;
            }else{
              $scope.showButton = true;
              sweet.show({
                title: 'Confirmar',
                text: 'Hemos finalizado la primera parte, falta poco para terminar.',
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#DD6B55',
                confirmButtonText: 'Si, Continuar!',
                closeOnConfirm: false,
                closeOnCancel: false
              }, function(isConfirm) {
                if (isConfirm) {
                  sweet.show('Evaluación 360!', '', 'success');
                  $scope.ok();
                }else{
                  sweet.show('Cancelar', 'La Evaluación no ha sido guardara :)', 'error');
                  $state.go('login');
                }
              });


            }
          }

    };



    pollsService.getUserPolls($scope.user.user.id)
      .then(function(response){
        if(response.data.user != null){
          $scope.poll_id = response.data.user.id;
          pollsService.getIdPolls(response.data.user.poll_id)
            .then(function(result){
              $scope.poll = result.data;
              $scope.show1 = true;
              $(".fakeloader").fadeOut();

            }, function(err){
                if(err.data !== undefined){
                  $state.go('login');
                }
            });
        }else{
          $scope.show3 = true;
        }

      }, function(err){
          if(err.data !== undefined){
            $state.go('login');
          }
      });


    $scope.ok = function(){

      $(".fakeloader").show();
      pollsService.saveAnswerPoll($scope.dataAnswers, $scope.poll_id)
        .then(function(result){
          $(".fakeloader").fadeOut();
          $scope.open();
        }, function(err){
          ngMessenger.displayErrorMessage('Error al procesar la evaluación. Intente de nuevo.');
          $(".fakeloader").fadeOut();
          $state.go('login');
        });



    };

    $scope.data = function(data, data1){

      $scope.showButton = false;
      var answer =  {
        'poll_id': $scope.poll_id,
        'answer_id': data1,
        'phrase_id': data.id
      };

      var index = $scope.dataAnswers.indexOf(answer);
      if(index == -1){
        $scope.dataAnswers.push(answer);

        for(var value in $scope.dataAnswers){
          if($scope.dataAnswers[value].phrase_id == data.id){
            var index1 = $scope.dataAnswers.indexOf($scope.dataAnswers[value]);
            $scope.dataAnswers.splice(index1);
            $scope.dataAnswers.push(answer);
          }else{
            $scope.dataAnswers.push(answer);
          }
        }
      }else{
        $scope.dataAnswers.splice(index, 1);
        $scope.dataAnswers.push(answer);
      }
      console.log($scope.dataAnswers);
    };



    $scope.open = function () {
      $scope.poll.poll_users = $scope.poll_id;
      var modalInstance = $uibModal.open({
        animation: 'true',
        templateUrl: 'myModalUser.html',
        controller: 'UserOtherQuestionController',
        size: 'lg',
        resolve: {
          poll: function () {
            return $scope.poll;
          },
          pollId: function () {
            return $scope.poll_id;
          }
        }
      });

      modalInstance.result.then(function () {
        ngMessenger.displaySuccessMessage('La Evaluación ha finalizado..');
        $timeout(function() {
          $state.go('login');
        }, 3000);

      }, function () {

      });
    };





    //logout sistema
    $scope.salir = function(){
      $auth.logout();
      $state.go('login');
    };
    //fin logout


  }
})();
