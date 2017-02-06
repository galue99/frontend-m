/**
 * Created by edgar on 18/01/17.
 */

(function() {
  'use strict';

  angular
    .module('charter')
    .controller('UsersAddController', UsersAddController);

  /** @ngInject */
  function UsersAddController($scope, $uibModalInstance, companyService, userService) {


    companyService.getCompany().then(function (data) {
      $scope.companys = data;
    });

    $scope.ok = function () {
      userService.saveUser($scope.user)
        .then(function (data){
          $uibModalInstance.close();
          $(".fakeloader").show();
        }, function (error) {
          $scope.server = error.data.message;

          $(".fakeloader").fadeOut();
        });


    };

    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };
  }
})();
