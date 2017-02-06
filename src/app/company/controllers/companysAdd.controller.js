/**
 * Created by edgar on 18/01/17.
 */

(function() {
  'use strict';

  angular
    .module('charter')
    .controller('CompanyAddController', CompanyAddController);

  /** @ngInject */
  function CompanyAddController($scope, $uibModalInstance, companyService, Upload, SERVER) {

    var vm = this;
    var token = localStorage.getItem("satellizer_token");

    companyService.getCompany().then(function (data) {
      $scope.companys = data;
    });



    $scope.ok = function (file) {

      $(".fakeloader").show();

      companyService.saveCompany(file, $scope.company.name)
        .then(function () {
          $uibModalInstance.close();

        }, function () {
          $(".fakeloader").fadeOut();
        });
    };

    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };
  }
})();
