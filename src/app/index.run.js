(function() {
  'use strict';

  angular
    .module('charter')
    .run(runBlock);

  /** @ngInject */
  function runBlock($log) {

    $log.debug('runBlock end');
  }

})();
