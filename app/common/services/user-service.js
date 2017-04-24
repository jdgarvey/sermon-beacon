angular.module('sermonBeacon.services.user', [

])
  .factory('UserService', function ($window) {
    var currentUser = angular.fromJson($window.sessionStorage.currentUser) || null;

    var getCurrentUser = function () {
      return currentUser;
    };

    var setCurrentUser = function(id, email, access_token) {
      if (!currentUser) {
        currentUser = {};
      }

      var json = {
        "id": id,
        "email": email,
        "access_token": access_token
      };
      
      currentUser = json;

      setSessionStorage();
    };

    var resetUser = function() {
      currentUser = null;
      setSessionStorage();
    };

    var setSessionStorage = function() {
      $window.sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
    };

    return {
      getCurrentUser: getCurrentUser,
      setCurrentUser: setCurrentUser,
      resetUser: resetUser
    }
  })
;