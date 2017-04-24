angular.module('sermonBeacon.services.login', [

])
  .service('LoginService', function (URI, $http, $q) {
    var login = this;

    this.login = function(email, password) {
      var deferred = $q.defer();
          url = URI + "clients/login";

      $http.post(
        url,
        {
          email: email,
          password: password
        })
      .success(deferred.resolve)
      .error(deferred.reject)
      ;

      return deferred.promise;
    };

    this.register = function(email, password) {
      var deferred = $q.defer();
          url = URI + "clients";

      $http.post(
        url,
        {
          email: email,
          password: password
        })
      .success(deferred.resolve)
      .error(deferred.reject)
      ;

      return deferred.promise;
    };
  })
;