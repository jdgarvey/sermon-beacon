angular.module('sermonBeacon.archives', [

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
      .state('archives', {
        url: '/',
        controller: 'ArchivesCtrl',
        templateUrl: 'app/archives/archives.tmpl.html',
        resolve: {
          currentUser: getCurrentUser
        }
      });
  })
  .controller('ArchivesCtrl', function ($scope, $location, sermons, currentUser) {
    $scope.currentDate = new Date();
    $scope.currentUser = currentUser; // for use in the sermon directive

    $scope.queryTypes = [
      {query: "title", label: "Title"},
      {query: "speaker", label: "Minister"},
      {query: "subject", label: "Subject"},
      {query: "series", label: "Series"},
    ];
    $scope.queryType = 'title';

    $scope.monthSelectorOptions = {
      start: 'year',
      depth: 'year'
    };
    $scope.editedSermonId = null;
    $scope.isEditing = false;
    $scope.editedSermon = {
      title: '',
      subject: '',
      speaker: '',
      series: '',
      date: '',
      files: [],
      private: false
    };

    $scope.getSermonsForMonth = function(){
      var currentDate = new Date($scope.currentDate);
      var year = moment(currentDate).year();
      var month = moment(currentDate).month();

      sermons
        .getSermonsForUser(currentUser.id, year, month)
        .then(
          function(sermons) {
            $scope.sermons = sermons;
          },
          function(error) {
            console.log(error);
          }
        )
      ;
    };

    $scope.search = function(searchText, queryType) {
      sermons.getSermonsByQuery($scope.currentUser.id, searchText, queryType)
        .then(function(response) {
          $scope.sermons = response;
        }, function(error) {
          console.log(error);
        });
    };
    
    if (currentUser) $scope.getSermonsForMonth();

    $scope.$watch('currentDate', function(newValue, oldValue){
      if(newValue !== oldValue) {
        $scope.getSermonsForMonth();
        $scope.resetSermon();
      }
    });

    $scope.selectSermon = function (sermonId, sermon) {
      $scope.editedSermonId = sermonId;
      $scope.editedSermon = sermon;

      $scope.isEditing = true;

    };

    $scope.saveSermon = function () {
      if ($scope.isEditing) {
        sermons
          .updateSermon($scope.editedSermon, currentUser.id)
          .then(
            function(response) {
              if ($scope.searchText && $scope.searchText.length > 0) {
                $scope.search($scope.searchText, $scope.queryType);
              } else {
                $scope.getSermonsForMonth();
              }
            },
            function(error) {
              console.log(error)
            }
          )
      } else {
        sermons
          .addSermon($scope.editedSermon, currentUser.id)
          .then(
            function(response) {
              if ($scope.searchText && $scope.searchText.length > 0) {
                $scope.search($scope.searchText, $scope.queryType);
              } else {
                $scope.getSermonsForMonth();
              }
            },
            function(error) {
              console.log(error);
            }
          )
        ;
      }

      $scope.isEditing = false;
      $scope.resetSermon();
    };

    $scope.removeSermon = function () {
      sermons
        .removeSermon($scope.editedSermon, currentUser.id)
        .then(
          function(response) {
            if ($scope.searchText && $scope.searchText.length > 0) {
              $scope.search($scope.searchText, $scope.queryType);
            } else {
              $scope.getSermonsForMonth();
            }
          },
          function(error) {
            console.log(error);
          }
        )
      ;
      $scope.resetSermon();
    };

    $scope.resetSermon = function () {
      $scope.editedSermonId = null;
      $scope.editedSermon = {
        title: '',
        subject: '',
        speaker: '',
        series: '',
        date: '',
        files: [],
        private: false
      };
      $scope.isEditing = false;
    };

  })
;