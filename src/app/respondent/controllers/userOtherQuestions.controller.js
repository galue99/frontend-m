/**
 * Created by edgar on 31/01/17.
 */
(function() {
  'use strict';

  angular
    .module('charter')
    .controller('UserOtherQuestionController', UserOtherQuestionController);

  /** @ngInject */
  function UserOtherQuestionController($scope, $uibModalInstance, otherQuestionService, poll, pollId, pollsService) {

    $scope.values="";

      otherQuestionService.getOtherQuestion(poll.poll.id)
        .then(function(response){
          $scope.questions = response.data.questions;
        });


      $scope.ok = function(data){
        $(".fakeloader").show();
        pollsService.saveAnswerOtherPoll($scope.questions, pollId)
          .then(function(result){
            $uibModalInstance.close();
          });
      };

    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };
  }
})();
