angular.module('sermonBeacon.embed', [
  'sermonBeacon.services.user'
])
  .controller('EmbedCtrl', function ($window, $scope, $location, sermons, UserService) {
      var searchObject = $location.search();
    $window.sessionStorage.embedUrl = $location.absUrl();
    $scope.currentUserId = null;
    $scope.currentDate = new Date();
    $scope.monthSelectorOptions = {
          start: 'year',
          depth: 'year'
      };
    $scope.queryTypes = [
      {query: "title", label: "Title"},
      {query: "speaker", label: "Minister"},
      {query: "subject", label: "Subject"},
      {query: "series", label: "Series"},
    ];
    $scope.queryType = 'title';

      $scope.$watch('currentDate', function (newValue, oldValue) {
          if (newValue !== oldValue) {
              $scope.getSermonsForMonth();
          }
      });

      $scope.currentUser = UserService.getCurrentUser();

      $scope.getEmbedPage = function (type) {
          var page = 'player.html';

          switch (type) {
              case 'Vimeo':
                  page = 'vimeo.html'
                  break;
          }

          return page;
      };

      $scope.getMediaTypeLabel = function (type) {
          var text = 'Watch';

          switch (type) {
              case 'Audio':
                  text = 'Listen';
                  break;
              case 'PDF':
                  text = 'PDF';
                  break;
              case 'MP3':
                  text = 'MP3';
                  break;
          }

          return text;
      };

      $scope.isEmbedded = function (type) {
          var embedded = true;

          switch (type) {
              case 'MP3':
              case 'PDF':
                  embedded = false;
                  break;
          }

          return embedded;
      };

      $scope.convertDate = function (dateValue) {
          // Discard time so as to keep dates accurate

          var realDate = dateValue.toString().split('T')[0];
          return moment(realDate).format('dddd, MMMM DD, YYYY');
      };

      $scope.getSermonsForMonth = function () {
          var currentDate = new Date($scope.currentDate);
          var year = moment(currentDate).year();
          var month = moment(currentDate).month();

          if ($scope.currentUserId) {
            sermons
              .getSermonsForUserNoAuth($scope.currentUserId, year, month)
              .then(
                function(response) {
                  $scope.sermons = response;
                },
                function(error) {
                  console.log(error);
                }
              )
            ;
          }
      };

      $scope.search = function(searchText, queryType) {
        sermons.getSermonsByQuery($scope.currentUserId, searchText, queryType)
          .then(function(response) {
            $scope.sermons = response;
          }, function(error) {
            console.log(error);
          });
      };

      if (searchObject.id) {
          $scope.currentUserId = searchObject.id;
          $scope.getSermonsForMonth();
      }
  })
;