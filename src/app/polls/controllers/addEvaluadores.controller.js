/**
 * Created by edgar on 29/01/17.
 */

(function() {
  'use strict';

  angular
    .module('charter')
    .controller('AddEvaluadoresController', AddEvaluadoresController);

  /** @ngInject */
  function AddEvaluadoresController($scope, $uibModalInstance, competitionsService, companyService, userService, poll, ngMessenger) {

    var vm = this;
    var token = localStorage.getItem("satellizer_token");

    $(".fakeloader").show();

    $scope.show = false;
    $scope.usersAssign = [];
    $scope.usersList = [];
    $scope.userObject = {};
    $scope.show1 = false;


    vm.allCompanys = function(){
      $(".fakeloader").show();
      companyService.getCompany()
        .then(function (response) {
          $scope.companys = response;
          $(".fakeloader").fadeOut();
        });
    };

    vm.allCompanys();


    $scope.allUserCompany = function(company){
      $(".fakeloader").show();
      $scope.company = company;
      userService.userByCompany(company)
        .then(function(result){
          $(".fakeloader").fadeOut();
          $scope.users = result.data.users;
          $scope.usersNew = JSON.parse(JSON.stringify(result.data.users));
          $scope.usersNew1 = JSON.parse(JSON.stringify(result.data.users));

        })
    };

    function arrayObjectIndexOf(id) {
      var myarr = $scope.usersNew;
      var searchTerm = parseInt(id), index = -1;

      for (var i = 0, len = myarr.length; i < len; i++) {
        if (parseInt(myarr[i].id) == parseInt(searchTerm)) {
          index = i;
          return index;
        }
      }
    }

    $scope.changeUser = function(user){
      $(".fakeloader").show();
      $scope.user = user;
      $scope.usersNew = JSON.parse(JSON.stringify($scope.usersNew1));
      $scope.show = true;
      userService.userAssign(user, poll.id)
        .then(function(result){
          $scope.assignUser = result.data.users;
          if($scope.assignUser.length !== 0){

            for (var data1 in $scope.users) {
              for (var data in $scope.assignUser) {

                if (parseInt($scope.assignUser[data].evaluador_id) === parseInt($scope.users[data1].id)) {
                  var index = arrayObjectIndexOf($scope.assignUser[data].evaluador_id);
                  $scope.usersNew.splice(index, 1);
                }

              }
            }
          }

          var index = arrayObjectIndexOf($scope.user);
          if(index !== undefined){
            $scope.usersNew.splice(index, 1);
          }
          $(".fakeloader").fadeOut();
        }, function (error) {
          $(".fakeloader").fadeOut();
        });

    };


    vm.allLevels = function(){
      companyService.getLevels()
        .then(function (response) {
          $scope.levels = response.data.levels;
          $(".fakeloader").fadeOut();
        }, function(){
          $(".fakeloader").fadeOut();
        });
    };

    vm.allLevels();

    $scope.levelSelect = function(data){
      $scope.level = data;
      if($scope.level == 5){
        $scope.show1 = false;
      }else{
        $scope.show1 = true;
      }
    };

    $scope.userSelect = function(data){

      var index1 = arrayObjectIndexOf($scope.user);

      var index = $scope.usersList.indexOf(data);

      if(index == -1){
        $scope.usersList.push(data);
      }else{
        $scope.usersList.splice(index, 1);
      }
    };






    $scope.ok = function () {

      if($scope.usersList.length > 0){
        vm.senData = {
          'evaluadores': $scope.usersList,
          'id_user': $scope.user,
          'id_encuesta': poll.id,
          'level': $scope.level,
          'status': 0,
          'length': $scope.usersList.length
        };

        userService.sendData(vm.senData)
          .then(function(response){
            ngMessenger.displaySuccessMessage('Usuario Evaluador Agregado con Exito');
            $scope.changeUser($scope.user);
            $scope.usersList = [];

          }, function(){
            $(".fakeloader").fadeOut();
          });

      }

      if($scope.level !== 5 && $scope.usersList.length < 0){
        ngMessenger.displayErrorMessage('Debe selecionar al menos un Usuario evaluador');
      }

      if($scope.level == 5){
        vm.senData = {
          'evaluadores': $scope.user,
          'id_user': $scope.user,
          'id_encuesta': poll.id,
          'level': $scope.level,
          'status': 0,
          'length': $scope.usersList.length
        };

        userService.sendData(vm.senData)
          .then(function(response){
            ngMessenger.displaySuccessMessage('Usuario Evaluador Agregado con Exito');
            $scope.changeUser($scope.user);
            $scope.usersList = [];

          }, function(){
            $(".fakeloader").fadeOut();
          });
      }
    };

    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };
  }
})();
