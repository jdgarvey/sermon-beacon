angular.module('sermonBeacon.components.sermon', [

])
  .directive('sermon', function ($firebase, URI, sermons) {
    var linker = function (scope, element, attrs) {
      scope.loaded = false;
      scope.sermonId = attrs['sermonId'];
      scope.datify();
      scope.files = scope.sermon.files;
    };

    var controller = function ($scope) {

      var updateSermon = function() {
        sermons
          .updateSermon($scope.sermon, $scope.currentUser.id)
          .then(
            function(response) {

            },
            function(error) {
              console.log(error);
            }
          )
        ;
      };

      $scope.newFile = null;
      $scope.sermon.files = $scope.sermon.files || [];


      $scope.resetForm = function () {
        $scope.newFile = null;
      };
      $scope.datify = function() {
        // Discard time so as to keep dates accurate
        var realDate = $scope.sermon.date.toString().split('T')[0];
        $scope.sermon.date = moment(realDate)._d;
      };

      $scope.$on('updateSermon', function (event, sermonId) {
        if (sermonId == $scope.sermonId) {
          $scope.datify();
        }
      });

      $scope.addFile = function () {
        if ($scope.newFile) $scope.sermon.files.push($scope.newFile);
        updateSermon();
        $scope.resetForm();
      };

      $scope.updateFile = function (id) {
        updateSermon();
      };

      $scope.removeFile = function (id) {
        $scope.sermon.files.splice(id, 1);
        updateSermon();
      };
    };

    return {
      scope: true,
      link: linker,
      controller: controller
    };
  })
;