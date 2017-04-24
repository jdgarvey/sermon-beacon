angular.module('embedSingleBeacon', [
  'ngSanitize',
  'sermonBeacon.models.sermons'
])
  .config(function ($sceProvider, $sceDelegateProvider) {
    $sceProvider.enabled(false);

    $sceDelegateProvider.resourceUrlWhitelist([
      // Allow same origin resource loads.
      'self',
      // Allow loading from our assets domain.  Notice the difference between * and **.
      'http://vimeo.com/**']);
  })
  .constant('URI', 'http://sbapiprod-30386.onmodulus.net/api/')

  .directive('jwplayer', function ($location, sermons) {
    var defaultProps = {
      id: 'angular-jwplayer-' + Math.floor((Math.random() * 999999999) + 1)
    };

    return {
      restrict: 'EC',
      scope: {
        id: '@id',
        setupVars: '=setup',
        files: '=files'
      },

      template: function (scope, element, attrs) {
        if (scope.id === null || typeof(scope.id) === undefined) {
          scope.id = defaultProps.id;
        }

        return "<div id='" + scope.id + "'></div>";
      },

      link: function (scope, element, attrs) {
        if (scope.id === null || typeof(scope.id) === undefined) {
          scope.id = defaultProps.id;
        }

        var initializePlayer = function () {
          scope.setupVars = {
            file: scope.file.url,
            width: 640,
            height: (scope.file.type == 'Audio') ? 24 : 360,
            controlbar: 'bottom',
            provider:'rtmp',
            streamer:'rtmp://50.22.213.201:1935/hv_ondemand/',
            modes: [
                { type: "flash",
                  src: "jwplayer/player.swf"
                },
                { type: "html5",
                  config: {
                    file: 'http://50.22.213.201:1935/hv_ondemand/_definst_/mp4:'+scope.file.url+'/playlist.m3u8',
                    provider: 'video'
                  }
                },
                { type: "download" }
            ]
          };

          jwplayer(scope.id).setup(scope.setupVars);
        };

        var searchObject = $location.search();

        if(searchObject.id !== null && searchObject.fid !== null) {
          scope.$watch('files', function() {

            if (scope.files !== undefined) {
              scope.file = scope.files[searchObject.fid];
              initializePlayer();
            }

          });

        }
      }
    };
  })
  .controller('EmbedDetails', function($window, $scope, $location, sermons, $anchorScroll){
    $scope.embedUrl = $window.sessionStorage.embedUrl;

    var searchObject = $location.search();
    $scope.isPreview = searchObject.preview || false;

    $scope.getSermon = function() {
      sermons.getSermon(searchObject.id)
        .then(
          function(response) {
            $scope.sermon = response;
          },
          function(error) {
            console.log(error);
          }
        )
      ;
    };

    if(searchObject.id !== null && searchObject.fid !== null) {
      $scope.getSermon();
    }

    // set the location.hash to the id of the element you wish to scroll to.
    //$location.hash('top');

    // call $anchorScroll()
    //$anchorScroll();
  })
  .controller('EmbedVimeoCtrl', function ($window, $scope, $location, sermons, $anchorScroll) {
    $scope.embedUrl = $window.sessionStorage.embedUrl;

    var searchObject = $location.search();
    
    $scope.isPreview = searchObject.preview || false;

    if(searchObject.id !== null && searchObject.fid !== null) {
      sermons.getSermon(searchObject.id)
        .then(
          function(response) {
            $scope.sermon = response;
            $scope.file = $scope.sermon.files[searchObject.fid]
            $scope.videoUrl = $scope.file.url;
          },
          function(error) {
            console.log(error);
          }
        )
      ;
      

    }

    // set the location.hash to the id of the element you wish to scroll to.
    //$location.hash('top');

    // call $anchorScroll()
    //$anchorScroll();
  })
;