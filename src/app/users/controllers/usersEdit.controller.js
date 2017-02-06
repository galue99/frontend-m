/**
 * Created by edgar on 18/01/17.
 */

(function() {
  'use strict';

  angular
    .module('charter')
    .controller('UsersEditController', UsersEditController);

  /** @ngInject */
  function UsersEditController($scope, $uibModalInstance, user, companyService, userService) {

    $scope.user = user;
    $scope.user.company_id = parseInt(user.company_id);

    companyService.getCompany().then(function (data) {
      $scope.companys = data;
    });


    $scope.sendData = function () {
      userService.editUser($scope.user)
        .then(function (data){
          $uibModalInstance.close();
          $(".fakeloader").show();
        }, function (error) {
          $scope.server = error.data;
          $(".fakeloader").fadeOut();
        });
    };

    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };
  }
})();
