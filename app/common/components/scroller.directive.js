angular.module('sermonBeacon.components.scroller', [])
.directive('scroller', function($window) {
  var linker = function(scope, element, attrs) {

    var w = angular.element($window),
        top = element[0].offsetTop;
    w.bind("scroll", function(event) {
      if (w[0].scrollY >= top) {
        element.addClass('new-sermon-form');
      } else {
        element.removeClass('new-sermon-form');
      }
    });
  };

  return {
    scope: true,
    link:linker
  }
  });
