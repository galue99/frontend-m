(function() {
  'use strict';

  angular
    .module('charter')
    .config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider, $urlRouterProvider) {


    function loginRequired($q, $location, $auth) {
      var deferred = $q.defer();
      if ($auth.isAuthenticated()) {
        deferred.resolve();
      } else {
        $location.path('/login');
      }
      return deferred.promise;
    }

    function respondentRequired($q, $location) {
      var deferred = $q.defer();
      if (localStorage.getItem("respondent")) {
        deferred.resolve();
      } else {
        $location.path('/login');
      }
      return deferred.promise;
    }

    $stateProvider
      .state('home', {
        templateUrl: 'app/template/admin.html',
        controller: 'AdminController',
        controllerAs: 'admin',
        resolve: {
          loginRequired: loginRequired
        }
      })
      .state('poll', {
        templateUrl: 'app/template/poll.html',
        controller: 'AdminController',
        controllerAs: 'admin',
        resolve: {
          respondentRequired: respondentRequired
        }
      })
      .state('poll.respondent', {
        url: '/respondent',
        templateUrl: 'app/respondent/view/respondent.html',
        controller: 'RespondentController',
        controllerAs: 'respondent'
      })
      .state('home.home', {
        url: '/',
        templateUrl: 'app/polls/views/polls.html',
        controller: 'PollsController',
        controllerAs: 'pollCtrl',
        resolve: {
          loginRequired: loginRequired
        }
      })
      .state('home.users', {
        url: '/Users',
        templateUrl: 'app/users/views/users.html',
        controller: 'UsersController',
        controllerAs: 'UsersCtrl',
        resolve: {
          loginRequired: loginRequired
        }
      })
      .state('home.companys', {
        url: '/Companys',
        templateUrl: 'app/company/views/companys.html',
        controller: 'CompanyController',
        controllerAs: 'CompanyCtrl',
        resolve: {
          loginRequired: loginRequired
        }
      })
      .state('home.competitions', {
        url: '/Competitions',
        templateUrl: 'app/competitions/views/competitions.html',
        controller: 'CompetitionsController',
        controllerAs: 'CompetitionsCtrl',
        resolve: {
          loginRequired: loginRequired
        }
      })
      .state('home.behaviors', {
        url: '/Behaviors',
        templateUrl: 'app/behaviors/views/behaviors.html',
        controller: 'BehaviorsController',
        controllerAs: 'BehaviorsCtrl',
        resolve: {
          loginRequired: loginRequired
        }
      })
      .state('home.polls', {
        url: '/Polls',
        templateUrl: 'app/polls/views/polls.html',
        controller: 'PollsController',
        controllerAs: 'PollsCtrl',
        resolve: {
          loginRequired: loginRequired
        }
      })
      .state('home.pollsView', {
        url: '/PollsView',
        templateUrl: 'app/polls/views/poll-finish.html',
        controller: 'PollsFinishController',
        controllerAs: 'PollsCtrl',
        resolve: {
          loginRequired: loginRequired
        }
      })
      .state('login', {
        url: '/login',
        templateUrl: 'app/login/login.html',
        controller: 'LoginController',
        controllerAs: 'login'
      });

    $urlRouterProvider.otherwise('/login');
  }

})();
