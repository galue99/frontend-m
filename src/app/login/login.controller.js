/**
 * Created by edgar on 07/11/16.
 */

(function() {
  'use strict';

  angular
    .module('charter')
    .controller('LoginController', LoginController);

  /** @ngInject */
  function LoginController($state, $scope, $auth, $sessionStorage, $rootScope, ngMessenger, $remember) {

    $scope.$on('$viewContentLoaded', function() {
      $(".fakeloader").fadeOut();
    });

    var vm = this;



    window.localStorage.removeItem("satellizer_token");
    window.localStorage.removeItem("respondent");
    window.localStorage.removeItem("admin_token");
    delete $sessionStorage.user;
    delete $sessionStorage.data;


    $scope.validationOptions = {
      rules: {
        username: {
          required: true,
          minlength: 3,
          maxlength: 15
        },
        password: {
          required: true,
          minlength: 3,
          maxlength: 15
        }
      },
      messages: {
        username: {
          required: "El campo es requerido",
          minlength: "Minimo 6 caracteres",
          maxlength: "Maximo 12 caracteres"
        },
        password: {
          required: "El campo es requerido",
        //  minlength: "Minimo 6 caracteres",
          maxlength: "Maximo 12 caracteres"
        }
      }
    };


    vm.submitForm = function(form){

      vm.submitted = true;
      // check to make sure the form is completely valid
      if (form.validate()) {

        $(".fakeloader").show();

        $auth.login({
            username: $scope.username,
            password: $scope.password
          })
          .then(function(response) {
            $(".fakeloader").fadeOut();
            $sessionStorage.user = response.data;
            $rootScope.user = $sessionStorage.user;

            if(response.data.user.rol_id != '1'){
              var token = localStorage.getItem("satellizer_token");
              localStorage.setItem("respondent", (token));
              $state.go('poll.respondent');
            }else{
              $state.go('home.home');
            }

            // Redirect user here after a successful log in.

          })
          .catch(function(response) {
            $(".fakeloader").fadeOut();


            ngMessenger.displayErrorMessage('Nombre de Usuario o Contraseña Invalidos');
            console.log(response);
            // Handle errors here, such as displaying a notification
            // for invalid email and/or password.
          });
      }else{
        ngMessenger.displayErrorMessage('Ingrese datos validos');
      }
    };




    $scope.username = $remember('username');
    $scope.password = $remember('password');

    $scope.rememberMe = function() {
      console.log($scope.remember);
      if ($scope.remember) {
        $remember('username', $scope.username);
        $remember('password', $scope.password);
      } else {
        $remember('username', '');
        $remember('password', '');
      }
    };



  }
})();
