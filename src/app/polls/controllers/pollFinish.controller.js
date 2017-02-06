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

    QuestionsService.pollFinish()
      .then(function(response){
        console.log(response);
        $scope.polls = response.data;
        console.log($scope.polls);

      }, function (err) {

      });



    $scope.showAnswer = function (poll) {
      QuestionsService.pollAnswer(poll.id)
        .then(function(response){
          $scope.answers = response.data.answers;
          $scope.other_question = response.data.other_question;
          console.log(response.data);
          $scope.show = true;

        })
    };


    $scope.backFunction = function(){
      $scope.show = !$scope.show;
    }



  }
})();
