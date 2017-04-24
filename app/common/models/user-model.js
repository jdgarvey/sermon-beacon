angular.module('sermonBeacon.models.user', [
  'sermonBeacon.services.login',
  'sermonBeacon.services.user'
])
  .factory('user', function ($rootScope, LoadingService, LoginService, $firebaseSimpleLogin, URI, $http, $q, UserService) {

    var login = function (email, password) {
      LoadingService.setLoading(true);

      LoginService
        .login(email, password)
        .then(
          function(myUser) {
            UserService.setCurrentUser(myUser.userId, email, myUser.id);
            LoadingService.setLoading(false);
            $rootScope.$broadcast('onLogin');
          },
          function(error) {
            UserService.resetUser();

            LoadingService.setLoading(false);

            var errorMessage = error.error.message;
            $rootScope.$broadcast('onLoginError', errorMessage);
          }
        )
      ;

    };

    var logout = function () {
      LoadingService.setLoading(true);

      UserService.resetUser();
      LoadingService.setLoading(false);
      $rootScope.$broadcast('onLogout');
    };

    var register = function (email, password) {
      LoadingService.setLoading(true);

      LoginService
        .register(email, password)
        .then(
          function(response) {
            login(email, password);
          },
          function(error) {
            console.log(error);
          }
        )
      ;
    };

    $rootScope.$on('$firebaseSimpleLogin:login', function (e, user) {
      currentUser = user;
      LoadingService.setLoading(false);
      $rootScope.$broadcast('onLogin');
    });

    $rootScope.$on('$firebaseSimpleLogin:logout', function (e) {
      currentUser = null;
      LoadingService.setLoading(false);
      $rootScope.$broadcast('onLogout');
    });

    $rootScope.$on('$firebaseSimpleLogin:error', function (e, err) {
      currentUser = null;

      $rootScope.$apply(function () {
        LoadingService.setLoading(false);
      });

      var errorMessage = err.message.replace('FirebaseSimpleLogin: ', '');
      $rootScope.$broadcast('onLoginError', errorMessage);
    });

    return {
      login: login,
      logout: logout,
      register: register
    }
  })
;