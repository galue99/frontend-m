Messenger.options = {
  extraClasses: 'messenger-fixed messenger-on-top messenger-on-right',
  theme: 'flat'
};

(function() {
  'use strict';

  angular
    .module('charter')
    .config(config);

  /** @ngInject */
  function config($logProvider, toastrConfig, $authProvider, SERVER) {

    // Enable log
    $logProvider.debugEnabled(true);

    // Set options third-party lib
    toastrConfig.allowHtml = true;
    toastrConfig.timeOut = 3000;
    toastrConfig.positionClass = 'toast-top-right';
    toastrConfig.preventDuplicates = true;
    toastrConfig.progressBar = true;

    $authProvider.loginUrl  = SERVER + "auth/login";
    $authProvider.signupUrl = SERVER + "auth/login";
    $authProvider.tokenType = 'Token';
    $authProvider.withCredentials = false;



  }

})();
