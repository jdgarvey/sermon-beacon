angular.module('sermonBeacon.login', [
])
  .config(function ($stateProvider) {
    var getCurrentUser = function (UserService, $location) {
      var currentUser = UserService.getCurrentUser();
      if (currentUser) {
        return currentUser;
      } else {
        $location.path('/login');
      }
    };

    $stateProvider
      .state('login', {
        url: '/login',
        controller: 'LoginCtrl',
        templateUrl: 'app/login/login.tmpl.html',
        resolve: {
          currentUser: getCurrentUser
        }
      });
  })
  .controller('LoginCtrl', function ($scope, $location, user) {
    $scope.user = {
      email: '',
      password: '',
      register: false
    };

    $scope.errorMessage = '';

    $scope.$on('onLoginError', function (evt, err) {
      $scope.errorMessage = err;
    });

    $scope.submit = function (email, password, register) {
      $scope.errorMessage = '';

      if ($scope.loginForm.$valid) {
        ((register) ? user.register : user.login)(email, password);
      }
      $scope.reset();
    };

    $scope.reset = function () {
      $scope.user = {
        email: '',
        password: '',
        register: false
      };
    };
  })
;