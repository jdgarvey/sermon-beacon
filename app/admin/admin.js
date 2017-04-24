angular.module('sermonBeacon.admin', [

])
  .config(function ($stateProvider) {
    var getCurrentUser = function (user) {
      return user.getCurrentUser();
    };

    $stateProvider
      .state('admin', {
        url: '/admin',
        controller: 'AdminCtrl',
        templateUrl: 'app/admin/admin.tmpl.html',
        resolve: {
          currentUser: getCurrentUser
        }
      });
  })
  .controller('AdminCtrl', function ($scope, $location, sermons, currentUser) {
    if (!currentUser) $location.path('/login');

    $scope.sermons = sermons.getSermons();

    $scope.removeSermon = function (sermon) {
      sermons.removeSermon(sermon);
    };
  })
;