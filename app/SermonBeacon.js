var app = angular.module('sermonBeacon', [
  'ui.router',
  'firebase',
  'kendo.directives',
  'sermonBeacon.components.sermon',
  'sermonBeacon.components.scroller',
  'sermonBeacon.models.sermons',
  'sermonBeacon.models.user',
  'sermonBeacon.admin',
  'sermonBeacon.archives',
  'sermonBeacon.login',
  'ui.bootstrap'
]);

app.constant('URI', 'http://sbapiprod-30386.onmodulus.net/api/');
//app.constant('URI', 'http://localhost:3000/api/');

app.config(function ($httpProvider, $stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('sermonBeacon', {
      url: '',
      abstract: true
    })
  ;
  $urlRouterProvider.otherwise('/');
  $httpProvider.interceptors.push('requestInterceptor');
});

app.controller('MainCtrl', ['$scope', '$location', 'UserService', 'user',
  function ($scope, $location, UserService, user) {
    $scope.logout = function () {
      user.logout();
    };

    $scope.$on('onLogin', function () {
      $scope.currentUser = UserService.getCurrentUser();
      $location.path('/');
    });

    $scope.$on('onLogout', function () {
      $scope.currentUser = null;
      $location.path('/login');
    });

    $scope.currentUser = UserService.getCurrentUser();
  }]);

app.factory('LoadingService', function ($rootScope) {
  var setLoading = function (loading) {
    $rootScope.loadingView = loading;
  };

  return {
    setLoading: setLoading
  }
});

app.factory('requestInterceptor', function (UserService) {
  var requestInterceptor = {
      request: function (config) {
          var currentUser = UserService.getCurrentUser();
          var access_token = currentUser ? currentUser.access_token : null;

          if(access_token) {
            config.headers.authorization = access_token;
          }
          return config;
      }
  }

  return requestInterceptor;
});

app.directive('ngReallyClick',
  function ($modal) {

    var ModalInstanceCtrl = function ($scope, $modalInstance) {
      $scope.ok = function () {
        $modalInstance.close();
      };

      $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
      };
    };

    return {
      restrict: 'A',
      scope: {
        ngReallyClick: "&"
      },
      link: function (scope, element, attrs) {
        element.bind('click', function () {
          var message = attrs.ngReallyMessage || "Are you sure ?";

          var modalHtml = '<div class="modal-body">' + message + '</div>';
          modalHtml += '<div class="modal-footer"><button class="btn btn-primary" ng-click="ok()">OK</button><button class="btn btn-warning" ng-click="cancel()">Cancel</button></div>';

          var modalInstance = $modal.open({
            template: modalHtml,
            controller: ModalInstanceCtrl
          });

          modalInstance.result.then(function () {
            scope.ngReallyClick();
          }, function () {
            //Modal dismissed
          });

        });

      }
    }
  });

