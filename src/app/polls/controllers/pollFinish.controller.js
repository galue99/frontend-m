/**
 * Created by edgar on 04/02/17.
 */


(function() {
  'use strict';

  angular
    .module('charter')
    .controller('PollsFinishController', PollsFinishController);

  /** @ngInject */
  function PollsFinishController($scope, QuestionsService ) {

    var vm = this;
    $scope.polls = {};
    $scope.show = false;

    $(".fakeloader").show();

    QuestionsService.pollFinish()
      .then(function(response){
        $scope.polls = response.data;
        $(".fakeloader").fadeOut();
      }, function (err) {

      });



    $scope.showAnswer = function (poll) {
      $(".fakeloader").show();

      QuestionsService.pollAnswer(poll.id)
        .then(function(response){
          $scope.answers = response.data.answers;
          $scope.other_question = response.data.other_question;
          $(".fakeloader").fadeOut();
          $scope.show = true;

        }, function(err){
           $(".fakeloader").fadeOut();
        })
    };


    $scope.backFunction = function(){
      $scope.show = !$scope.show;
    }



  }
})();
