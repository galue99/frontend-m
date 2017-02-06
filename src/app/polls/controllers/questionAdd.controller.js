/**
 * Created by edgar on 28/01/17.
 */

(function() {
  'use strict';

  angular
    .module('charter')
    .controller('QuestionAddController', QuestionAddController);

  /** @ngInject */
  function QuestionAddController($scope, $uibModalInstance, QuestionsService, poll ) {

    var vm = this;
    var token = localStorage.getItem("satellizer_token");

    vm.getQuestions = function(){
      QuestionsService.getQuestionsByPoll(poll.id).then(function (result) {
        $scope.questions = result.data.questions[0].question;
      });
    };

    vm.getQuestions();

    $scope.ok = function () {

      $(".fakeloader").show();

      QuestionsService.saveQuestion($scope.question, poll.id)
        .then(function (result) {
          $scope.questions.push(result.data.Question);
          $scope.question = "";
          //$scope.questions.questions = data;
          //$uibModalInstance.close();
          $(".fakeloader").fadeOut();
        }, function () {
          $(".fakeloader").fadeOut();
        });
    };


    $scope.validationOptions = {
      rules: {
        name: {
          required: true,
          minlength: 4
        }
      },
      messages: {
        name: {
          required: "El campo es requerido",
          minlength: "Minimo 4 caracteres",
          maxlength: "Maximo 12 caracteres"
        }
      }
    };






    $scope.deleteQuestion = function(question){

      $(".fakeloader").show();

      QuestionsService.deleteQuestion(question.id)
        .then(function (result) {
          vm.getQuestions();
          //$scope.questions.questions = data;
          //$uibModalInstance.close();
          $(".fakeloader").fadeOut();
        }, function () {
          $(".fakeloader").fadeOut();
        });

    };

    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };
  }
})();
