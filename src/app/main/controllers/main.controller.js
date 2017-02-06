

(function() {
  'use strict';

  angular
    .module('charter')
    .controller('MainController', MainController);

  /** @ngInject */
  function MainController($scope, $http, SERVER, $log, ngMessenger, sweet) {
    var vm = this;


    var token = localStorage.getItem("satellizer_token");



  }
})();
