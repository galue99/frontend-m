/**
 * Created by edgar on 05/12/16.
 */
(function() {
  'use strict';

  angular
    .module('charter')
    .factory('Auth', function($resource, $rootScope, $sessionStorage, $q){

      /**
       *  User profile resource
       */
      var Profile = $resource('/api/profile', {}, {
        login: {
          method: "POST",
          isArray : false
        }
      });

      var auth = {};

      /**
       *  Saves the current user in the root scope
       *  Call this in the app run() method
       */



      auth.checkPermissionForView = function(view) {
        if (!view.requiresAuthentication) {
          return true;
        }

        return userHasPermissionForView(view);
      };


      var userHasPermissionForView = function(view){
        if(!auth.isLoggedIn()){
          return false;
        }

        if(!view.permissions || !view.permissions.length){
          return true;
        }

        return auth.userHasPermission(view.permissions);
      };


      auth.userHasPermission = function(permissions){
        if(!auth.isLoggedIn()){
          return false;
        }

        var found = false;
        angular.forEach(permissions, function(permission, index){
          if ($sessionStorage.user.typeAdmin.indexOf(permission) >= 0){
            found = true;
            return;
          }
        });

        return found;
      };


      auth.currentUser = function(){
        return $sessionStorage.user;
      };


      auth.isLoggedIn = function(){
        return $sessionStorage.user != null;
      };


      return auth;
    })
    .factory('userService', function($http, $log, $q, SERVER) {
      return {
        getUser: function(user) {
          var defered = $q.defer();
          var token = window.localStorage.getItem('satellizer_token');
          return $http({
            url: SERVER + 'api/users?token=' + token,
            method: 'GET',
            timeout: 30000,
            headers: {
              'Content-Type': 'application/json; charset=UTF-8'
            }
          }).success(function(data) {
            defered.resolve(data);
          })
            .error(function(error) {
              defered.reject(error);
            });
          return defered.promise;
        },
        saveUser: function(user) {
          var defered = $q.defer();
          var token = window.localStorage.getItem('satellizer_token');
          return $http({
            url: SERVER + 'api/users?token=' + token,
            data: user,
            method: 'POST',
            timeout: 30000,
            headers: {
              'Content-Type': 'application/json; charset=UTF-8'
            }
          }).success(function(data) {
              defered.resolve(data);
            })
            .error(function(error) {
              defered.reject(error);
            });
          return defered.promise;
        },
        editUser: function(user) {
          var defered = $q.defer();
          var token = window.localStorage.getItem('satellizer_token');
          return $http({
            url: SERVER + 'api/users/' + user.id + '?token=' + token,
            data: user,
            method: 'PUT',
            timeout: 30000,
            headers: {
              'Content-Type': 'application/json; charset=UTF-8'
            }
          }).success(function(data) {
            defered.resolve(data);
          })
            .error(function(error) {
              defered.reject(error);
            });
          return defered.promise;
        },
        deleteUser: function(user) {
          var defered = $q.defer();
          var token = window.localStorage.getItem('satellizer_token');
          return $http({
            url: SERVER + 'api/users/' + user.id + '?token=' + token,
            method: 'Delete',
            timeout: 30000,
            headers: {
              'Content-Type': 'application/json; charset=UTF-8'
            }
          }).success(function(data) {
            defered.resolve(data);
          })
            .error(function(error) {
              defered.reject(error);
            });
          return defered.promise;
        },
        userByCompany: function(id) {
          var defered = $q.defer();
          var token = window.localStorage.getItem('satellizer_token');
          return $http({
            url: SERVER + 'api/usersCompany/' + id + '?token=' + token,
            method: 'GET',
            timeout: 30000,
            headers: {
              'Content-Type': 'application/json; charset=UTF-8'
            }
          }).success(function(data) {
            defered.resolve(data);
          })
            .error(function(error) {
              defered.reject(error);
            });
          return defered.promise;
        },
        userAssign: function(id, poll_id) {
          var defered = $q.defer();
          var token = window.localStorage.getItem('satellizer_token');
          return $http({
            url: SERVER + 'api/usersAssign/' + id + '/' + poll_id + '?token=' + token,
            method: 'GET',
            timeout: 30000,
            headers: {
              'Content-Type': 'application/json; charset=UTF-8'
            }
          }).success(function(data) {
            defered.resolve(data);
          })
            .error(function(error) {
              defered.reject(error);
            });
          return defered.promise;
        },
        sendData: function(data) {
          var defered = $q.defer();
          var token = window.localStorage.getItem('satellizer_token');
          return $http({
            url: SERVER + 'api/postData?token=' + token,
            method: 'POST',
            data: data,
            timeout: 30000,
            headers: {
              'Content-Type': 'application/json; charset=UTF-8'
            }
          }).success(function(data) {
            defered.resolve(data);
          })
            .error(function(error) {
              defered.reject(error);
            });
          return defered.promise;
        }
      }
    })
    .factory('companyService', function($http, $log, $q, SERVER, Upload) {
      return {
        getCompany: function() {
          var defered = $q.defer();
          var token = window.localStorage.getItem('satellizer_token');
          $http.get(SERVER + 'api/company?token=' + token )
            .success(function(data) {
              defered.resolve(data);
            })
            .error(function(error) {
              defered.reject(error);
            });
          return defered.promise;
        },
        saveCompany: function(file, name) {
          var defered = $q.defer();
          var token = window.localStorage.getItem('satellizer_token');

          return Upload.upload({
            url: SERVER +'api/company?token=' + token,
            data: {image: file, 'name': name},
            headers: {
              'Content-Type': 'application/json; charset=UTF-8'
            }
          }).success(function (resp) {
            defered.resolve(resp);
          }, function (resp) {
            defered.reject(resp);
          });
          return defered.promise;
        },
        editCompany: function(file, name, id) {

          var defered = $q.defer();
          var token = window.localStorage.getItem('satellizer_token');

          return Upload.upload({
            url: SERVER +'api/companyPost/' +id +'?token=' + token,
            data: {image: file, 'name': name},
            headers: {
              'Content-Type': 'application/json; charset=UTF-8'
            }
          }).success(function (resp) {
            defered.resolve(resp);
          }, function (resp) {
            defered.reject(resp);
          });
          return defered.promise;
        },
        deleteCompany: function(company) {
          var defered = $q.defer();
          var token = window.localStorage.getItem('satellizer_token');
          return $http({
            url: SERVER + 'api/company/' + company.id + '?token=' + token,
            method: 'Delete',
            timeout: 60000,
            headers: {
              'Content-Type': 'application/json; charset=UTF-8'
            }
          }).success(function(data) {
            defered.resolve(data);
          })
            .error(function(error) {
              defered.reject(error);
            });
          return defered.promise;
        },
        getLevels: function() {
          var defered = $q.defer();
          var token = window.localStorage.getItem('satellizer_token');
          return $http({
            url: SERVER + 'api/levels?token=' + token,
            method: 'GET',
            timeout: 30000,
            headers: {
              'Content-Type': 'application/json; charset=UTF-8'
            }
          }).success(function(data) {
            defered.resolve(data);
          })
            .error(function(error) {
              defered.reject(error);
            });
          return defered.promise;
        }
      }
    })
    .factory('competitionsService', function($http, $log, $q, SERVER) {
      return {
        getCompetitions: function() {
          var defered = $q.defer();
          var token = window.localStorage.getItem('satellizer_token');
          $http.get(SERVER + 'api/competitions?token=' + token )
            .success(function(data) {
              defered.resolve(data);
            })
            .error(function(error) {
              defered.reject(error);
            });
          return defered.promise;
        },
        getCompetitionsById: function(id) {
          var defered = $q.defer();
          var token = window.localStorage.getItem('satellizer_token');
          $http.get(SERVER + 'api/companyByCompetition/' + id + '?token=' + token )
            .success(function(data) {
              defered.resolve(data);
            })
            .error(function(error) {
              defered.reject(error);
            });
          return defered.promise;
        },
        getCompetitionsByType: function() {
          var defered = $q.defer();
          var token = window.localStorage.getItem('satellizer_token');
          $http.get(SERVER + 'api/competitionsType?token=' + token)
            .success(function(data) {
              defered.resolve(data);
            })
            .error(function(error) {
              defered.reject(error);
            });
          return defered.promise;
        },
        saveCompetitions: function(data) {
          console.log(data);
          var defered = $q.defer();
          var token = window.localStorage.getItem('satellizer_token');

          return $http({
            url: SERVER +'api/competitions?token=' + token,
            data: data,
            method: 'POST',
            headers: {
              'Content-Type': 'application/json; charset=UTF-8'
            }
          }).success(function (data) {
            defered.resolve(data);
          }, function (err) {
            defered.reject(err);
          });
          return defered.promise;
        },
        saveCompetitionsMejorar: function(data) {
          console.log(data);
          var defered = $q.defer();
          var token = window.localStorage.getItem('satellizer_token');

          return $http({
            url: SERVER +'api/competitionsSaveMejorar?token=' + token,
            data: data,
            method: 'POST',
            headers: {
              'Content-Type': 'application/json; charset=UTF-8'
            }
          }).success(function (data) {
            defered.resolve(data);
          }, function (err) {
            defered.reject(err);
          });
          return defered.promise;
        },
        editCompetitions: function(competition) {
          var defered = $q.defer();
          var token = window.localStorage.getItem('satellizer_token');

          return $http({
            url: SERVER +'api/competitions/' + competition.id +'?token=' + token,
            data: competition,
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json; charset=UTF-8'
            }
          }).success(function (resp) {
            defered.resolve(resp);
          }, function (resp) {
            defered.reject(resp);
          });
          return defered.promise;
        },
        deletecompetitions: function(competition) {
          var defered = $q.defer();
          var token = window.localStorage.getItem('satellizer_token');
          return $http({
            url: SERVER + 'api/competitions/' + competition.id + '?token=' + token,
            method: 'Delete',
            timeout: 30000,
            headers: {
              'Content-Type': 'application/json; charset=UTF-8'
            }
          }).success(function(data) {
            defered.resolve(data);
          })
            .error(function(error) {
              defered.reject(error);
            });
          return defered.promise;
        },
        getMejorarCompetitions: function() {
          var defered = $q.defer();
          var token = window.localStorage.getItem('satellizer_token');
          return $http({
            url: SERVER + 'api/competitionsMejorar?token=' + token,
            method: 'GET',
            timeout: 30000,
            headers: {
              'Content-Type': 'application/json; charset=UTF-8'
            }
          }).success(function(data) {
            defered.resolve(data);
          })
            .error(function(error) {
              defered.reject(error);
            });
          return defered.promise;
        },
        getCompetitionsByIdCompany: function(id) {
          var defered = $q.defer();
          var token = window.localStorage.getItem('satellizer_token');
          return $http({
            url: SERVER + 'api/competitionsBehaviorId/' + id +'?token=' + token,
            method: 'GET',
            timeout: 30000,
            headers: {
              'Content-Type': 'application/json; charset=UTF-8'
            }
          }).success(function(data) {
            defered.resolve(data);
          })
            .error(function(error) {
              defered.reject(error);
            });
          return defered.promise;
        }
      }
    })
    .factory('behaviorsService', function($http, $log, $q, SERVER) {
    return {
      saveBehaviors: function(data) {
        var defered = $q.defer();
        var token = window.localStorage.getItem('satellizer_token');

        return $http({
          url: SERVER +'api/behaviors?token=' + token,
          data: data,
          method: 'POST',
          headers: {
            'Content-Type': 'application/json; charset=UTF-8'
          }
        }).success(function (data) {
          defered.resolve(data);
        }, function (err) {
          defered.reject(err);
        });
        return defered.promise;
      },
      editBehaviors: function(behavior) {
        var defered = $q.defer();
        var token = window.localStorage.getItem('satellizer_token');

        return $http({
          url: SERVER +'api/behaviors/' + behavior.id +'?token=' + token,
          data: behavior,
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json; charset=UTF-8'
          }
        }).success(function (resp) {
          defered.resolve(resp);
        }, function (resp) {
          defered.reject(resp);
        });
        return defered.promise;
      },
      competitionBehaviors: function() {
        var defered = $q.defer();
        var token = window.localStorage.getItem('satellizer_token');
        return $http({
          url: SERVER + 'api/competitionsBehaviorId?token=' + token,
          method: 'GET',
          timeout: 30000,
          headers: {
            'Content-Type': 'application/json; charset=UTF-8'
          }
        }).success(function(data) {
          defered.resolve(data);
        })
          .error(function(error) {
            defered.reject(error);
          });
        return defered.promise;
      },
      deleteBehaviors: function(behavior) {
        var defered = $q.defer();
        var token = window.localStorage.getItem('satellizer_token');
        return $http({
          url: SERVER + 'api/behaviors/' + behavior.id + '?token=' + token,
          method: 'Delete',
          timeout: 30000,
          headers: {
            'Content-Type': 'application/json; charset=UTF-8'
          }
        }).success(function(data) {
          defered.resolve(data);
        })
          .error(function(error) {
            defered.reject(error);
          });
        return defered.promise;
      }
    }
  })
    .factory('pollsService', function($http, $log, $q, SERVER, $auth) {
      return {
        savePoll: function(data) {
          var defered = $q.defer();
          var token = window.localStorage.getItem('satellizer_token');

          return $http({
            url: SERVER +'api/polls?token=' + token,
            data: data,
            method: 'POST',
            headers: {
              'Content-Type': 'application/json; charset=UTF-8'
            }
          }).success(function (data) {
            defered.resolve(data);
          }, function (err) {
            defered.reject(err);
          });
          return defered.promise;
        },
        editBehaviors: function(behavior) {
          var defered = $q.defer();
          var token = window.localStorage.getItem('satellizer_token');

          return $http({
            url: SERVER +'api/behaviors/' + behavior.id +'?token=' + token,
            data: behavior,
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json; charset=UTF-8'
            }
          }).success(function (resp) {
            defered.resolve(resp);
          }, function (resp) {
            defered.reject(resp);
          });
          return defered.promise;
        },
        getPolls: function() {
          var defered = $q.defer();
          var token = window.localStorage.getItem('satellizer_token');
          return $http({
            url: SERVER + 'api/polls?token=' + token,
            method: 'GET',
            timeout: 30000,
            headers: {
              'Content-Type': 'application/json; charset=UTF-8'
            }
          }).success(function(data) {
            defered.resolve(data);
          })
            .error(function(error) {
              defered.reject(error);
            });
          return defered.promise;
        },
        getUserPolls: function(id) {
          var defered = $q.defer();
          return $http({
            url: SERVER + 'api/findUserPoll/' + id + '?token=' + $auth.getToken(),
            method: 'GET',
            timeout: 30000,
            headers: {
              'Content-Type': 'application/json; charset=UTF-8'
            }
          }).success(function(data) {
            defered.resolve(data);
          })
            .error(function(error) {
              defered.reject(error);
            });
          return defered.promise;
        },
        getIdPolls: function(id) {
          var defered = $q.defer();
          var token = window.localStorage.getItem('satellizer_token');
          return $http({
            url: SERVER + 'api/polls/' + id + '?token=' + token,
            method: 'GET',
            timeout: 30000,
            headers: {
              'Content-Type': 'application/json; charset=UTF-8'
            }
          }).success(function(data) {
            defered.resolve(data);
          })
            .error(function(error) {
              defered.reject(error);
            });
          return defered.promise;
        },
        pollByUser: function(id) {
          var defered = $q.defer();
          var token = window.localStorage.getItem('satellizer_token');
          return $http({
            url: SERVER + 'api/pollByUser/'+ id + '?token=' + token,
            method: 'GET',
            timeout: 30000,
            headers: {
              'Content-Type': 'application/json; charset=UTF-8'
            }
          }).success(function(data) {
            defered.resolve(data);
          })
            .error(function(error) {
              defered.reject(error);
            });
          return defered.promise;
        },
        deletePoll: function(poll) {
          var defered = $q.defer();
          var token = window.localStorage.getItem('satellizer_token');
          return $http({
            url: SERVER + 'api/polls/' + poll.id + '?token=' + token,
            method: 'Delete',
            timeout: 30000,
            headers: {
              'Content-Type': 'application/json; charset=UTF-8'
            }
          }).success(function(data) {
            defered.resolve(data);
          })
            .error(function(error) {
              defered.reject(error);
            });
          return defered.promise;
        },
        saveAnswerPoll: function(data, poll_id) {
          data = {'answers': data, 'poll_users_id': poll_id};
          var defered = $q.defer();
          var token = window.localStorage.getItem('satellizer_token');
          return $http({
            url: SERVER + 'api/pollAnswerUser?token=' + token,
            method: 'POST',
            data: data,
            timeout: 300000,
            headers: {
              'Content-Type': 'application/json; charset=UTF-8'
            }
          }).success(function(data) {
            defered.resolve(data);
          })
            .error(function(error) {
              defered.reject(error);
            });
          return defered.promise;
        },
        saveAnswerOtherPoll: function(data, poll_id) {
          data = {'answers': data, 'poll_users_id': poll_id};
          var defered = $q.defer();
          var token = window.localStorage.getItem('satellizer_token');
          return $http({
            url: SERVER + 'api/pollAnswerOther?token=' + token,
            method: 'POST',
            data: data,
            timeout: 30000,
            headers: {
              'Content-Type': 'application/json; charset=UTF-8'
            }
          }).success(function(data) {
            defered.resolve(data);
          })
            .error(function(error) {
              defered.reject(error);
            });
          return defered.promise;
        },
        deleteUserAssign: function(data) {
          var defered = $q.defer();
          var token = window.localStorage.getItem('satellizer_token');
          return $http({
            url: SERVER + 'api/deleteUserAssign/' + data.id +'?token=' + token,
            method: 'GET',
            timeout: 30000,
            headers: {
              'Content-Type': 'application/json; charset=UTF-8'
            }
          }).success(function(data) {
            defered.resolve(data);
          })
            .error(function(error) {
              defered.reject(error);
            });
          return defered.promise;
        },
        deleteUser: function(data) {
          var defered = $q.defer();
          var token = window.localStorage.getItem('satellizer_token');
          return $http({
            url: SERVER + 'api/deleteUser/' + data.id +'?token=' + token,
            method: 'GET',
            timeout: 30000,
            headers: {
              'Content-Type': 'application/json; charset=UTF-8'
            }
          }).success(function(data) {
            defered.resolve(data);
          })
            .error(function(error) {
              defered.reject(error);
            });
          return defered.promise;
        }
      }
    })
    .factory('QuestionsService', function($http, $log, $q, SERVER, $auth) {
      return {
        saveQuestion: function(question, id) {
          var defered = $q.defer();
          var token = window.localStorage.getItem('satellizer_token');
          var data = {'poll_id': id, 'question': question};
          return $http({
            url: SERVER +'api/question?token=' + token,
            data: data,
            method: 'POST',
            headers: {
              'Content-Type': 'application/json; charset=UTF-8'
            }
          }).success(function (data) {
            defered.resolve(data);
          }, function (err) {
            defered.reject(err);
          });
          return defered.promise;
        },
        getQuestions: function() {
          var defered = $q.defer();
          var token = window.localStorage.getItem('satellizer_token');
          return $http({
            url: SERVER + 'api/question?token=' + token,
            method: 'GET',
            timeout: 30000,
            headers: {
              'Content-Type': 'application/json; charset=UTF-8'
            }
          }).success(function(data) {
            defered.resolve(data);
          })
            .error(function(error) {
              defered.reject(error);
            });
          return defered.promise;
        },
        getQuestionsByPoll: function(id) {
          var defered = $q.defer();
          var token = window.localStorage.getItem('satellizer_token');
          return $http({
            url: SERVER + 'api/questionByPoll/' + id + '?token=' + token,
            method: 'GET',
            timeout: 30000,
            headers: {
              'Content-Type': 'application/json; charset=UTF-8'
            }
          }).success(function(data) {
            defered.resolve(data);
          })
            .error(function(error) {
              defered.reject(error);
            });
          return defered.promise;
        },
        deleteQuestion: function(id) {
          var defered = $q.defer();
          var token = window.localStorage.getItem('satellizer_token');
          return $http({
            url: SERVER + 'api/question/' + id + '?token=' + token,
            method: 'Delete',
            timeout: 30000,
            headers: {
              'Content-Type': 'application/json; charset=UTF-8'
            }
          }).success(function(data) {
            defered.resolve(data);
          })
            .error(function(error) {
              defered.reject(error);
            });
          return defered.promise;
        },
        pollFinish: function(id) {
          var defered = $q.defer();
          var token = window.localStorage.getItem('satellizer_token');
          return $http({
            url: SERVER + 'api/pollFinish/' + id +'?token=' + token,
            method: 'get',
            timeout: 30000,
            headers: {
              'Content-Type': 'application/json; charset=UTF-8'
            }
          }).success(function(data) {
              defered.resolve(data);
          })
            .error(function(error) {
              defered.reject(error);
            });
          return defered.promise;
        },
        pollAnswer: function(id) {
          var defered = $q.defer();
          var token = window.localStorage.getItem('satellizer_token');
          return $http({
            url: SERVER + 'api/details_answers/' + id + '?token=' + token,
            method: 'get',
            timeout: 30000,
            headers: {
              'Content-Type': 'application/json; charset=UTF-8'
            }
          }).success(function(data) {
            defered.resolve(data);
          })
            .error(function(error) {
              defered.reject(error);
            });
          return defered.promise;
        }
      }
    })
    .factory('ReportService', function($http, $log, $q, SERVER, $auth) {
      return {
        printReport: function(id, encuesta_id) {
          var defered = $q.defer();
          var token = window.localStorage.getItem('satellizer_token');
          return $http({
            url: SERVER + 'api/printReport/' + id + '/' + encuesta_id +'?token=' + token,
            method: 'GET',
            timeout: 30000,
            headers: {
              'Content-Type': 'application/json; charset=UTF-8'
            }
          }).success(function(data) {
            defered.resolve(data);
          })
            .error(function(error) {
              defered.reject(error);
            });
          return defered.promise;
        },
        printReport1: function(id, encuesta_id) {
          var defered = $q.defer();
          var token = window.localStorage.getItem('satellizer_token');
          return $http({
            url: SERVER + 'api/printReport1/' + id + '/' + encuesta_id +'?token=' + token,
            method: 'GET',
            timeout: 30000,
            headers: {
              'Content-Type': 'application/json; charset=UTF-8'
            }
          }).success(function(data) {
            defered.resolve(data);
          })
            .error(function(error) {
              defered.reject(error);
            });
          return defered.promise;
        }
      }
    })
    .factory('otherQuestionService', function($http, $log, $q, SERVER, $auth) {
      return {
        getOtherQuestion: function(id) {
          var defered = $q.defer();
          var token = window.localStorage.getItem('satellizer_token');
          return $http({
            url: SERVER + 'api/otherQuestion/' + id +'?token=' + token,
            method: 'GET',
            timeout: 30000,
            headers: {
              'Content-Type': 'application/json; charset=UTF-8'
            }
          }).success(function(data) {
            defered.resolve(data);
          })
            .error(function(error) {
              defered.reject(error);
            });
          return defered.promise;
        },
        printReport1: function(id, encuesta_id) {
          var defered = $q.defer();
          var token = window.localStorage.getItem('satellizer_token');
          return $http({
            url: SERVER + 'api/printReport1/' + id + '/' + encuesta_id +'?token=' + token,
            method: 'GET',
            timeout: 30000,
            headers: {
              'Content-Type': 'application/json; charset=UTF-8'
            }
          }).success(function(data) {
            defered.resolve(data);
          })
            .error(function(error) {
              defered.reject(error);
            });
          return defered.promise;
        }
      }
    })
    .factory('emailService', function($http, $log, $q, SERVER, $auth) {
      return {
        sendEmail: function(id) {
          var defered = $q.defer();
          var token = window.localStorage.getItem('satellizer_token');
          return $http({
            url: SERVER + 'api/email/' + id +'?token=' + token,
            method: 'GET',
            timeout: 30000,
            headers: {
              'Content-Type': 'application/json; charset=UTF-8'
            }
          }).success(function(data) {
            defered.resolve(data);
          })
            .error(function(error) {
              defered.reject(error);
            });
          return defered.promise;
        }
      }
    });

})();
