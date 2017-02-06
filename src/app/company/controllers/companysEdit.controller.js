/**
 * Created by edgar on 18/01/17.
 */

(function() {
  'use strict';

  angular
    .module('charter')
    .controller('CompanyEditController', CompanyEditController);

  /** @ngInject */
  function CompanyEditController($scope, $uibModalInstance, companyService, company) {

    var vm = this;
    var token = localStorage.getItem("satellizer_token");
    console.log(company);
    $scope.company = company;

    $scope.picFile = company.url;

    $scope.ok = function (file) {

      $(".fakeloader").show();

      companyService.editCompany(file, $scope.company.name, company.id)
        .then(function () {
          $uibModalInstance.close();
        }, function () {
          $(".fakeloader").fadeOut();
        });
    };


    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
  }
})();
