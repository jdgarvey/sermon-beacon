angular.module('sermonBeacon.models.sermons', [

])
  .factory('sermons', function ($rootScope, $http, URI, $q) {
    var toISO = function(year, month) {
      var month = month + 1,
        endDate = new Date(year, month, 00).getDate();

      if (month.toString().length == 1) {
        month = '0' + (month).toString();
      }

      var fromDate = year + '-' + month + '-' + '01T00:00:00Z',
        toDate = year + '-' + month + '-' + endDate.toString() + 'T23:59:59Z';

      return {
        fromDate: fromDate,
        toDate: toDate
      };
    };

    var getSermonsByQuery = function(userId, searchText, queryType) {
      var queryJson = {
        "where": {
          "clientId": userId
        }
      };

      queryJson["where"][queryType] = {
        "like": searchText,
        "options": "i"
      };

      var query = '?filter=' + JSON.stringify(queryJson),
        deferred = $q.defer(),
        url = URI + 'sermons' + query;

      $http.get(url)
        .success(deferred.resolve)
        .error(deferred.reject)
      ;

      return deferred.promise;
    }

    var getSermonsForUser = function (userId, year, month) {
      var date = toISO(year, month),
        query = '?filter[where][date][between][0]=' + date.fromDate + '&filter[where][date][between][1]=' + date.toDate;

      var deferred = $q.defer();
      url = URI + 'clients/' + userId + '/sermons' + query;

      $http.get(url)
        .success(deferred.resolve)
        .error(deferred.reject)
      ;

      return deferred.promise;
    };

    var getSermonsForUserNoAuth = function (userId, year, month) {
      var date = toISO(year, month),
        query = '?filter[where][clientId]=' + userId + '&filter[where][date][between][0]=' + date.fromDate + '&filter[where][date][between][1]=' + date.toDate;

      var deferred = $q.defer();
      url = URI + 'sermons' + query;

      $http.get(url)
        .success(deferred.resolve)
        .error(deferred.reject)
      ;

      return deferred.promise;
    };

    var getSermon = function(sermonId) {
      var deferred = $q.defer();
      url = URI + 'sermons/' + sermonId;

      $http.get(url)
        .success(deferred.resolve)
        .error(deferred.reject)
      ;

      return deferred.promise;
    };

    var addSermon = function (sermon, userId) {

      var deferred = $q.defer();
      url = URI + 'clients/' + userId + '/sermons';

      $http.post(url, sermon)
        .success(deferred.resolve)
        .error(deferred.reject)
      ;

      return deferred.promise;
    };

    var updateSermon = function (sermon, userId) {
      var deferred = $q.defer();
      url = URI + 'clients/' + userId + '/sermons/' + sermon.id;

      $http.put(url, sermon)
        .success(deferred.resolve)
        .error(deferred.reject)
      ;

      return deferred.promise;
      $rootScope.$broadcast('updateSermon', sermonId)
    };

    var removeSermon = function (sermon, userId) {
      var deferred = $q.defer();
      url = URI + 'clients/' + userId + '/sermons/' + sermon.id;

      $http.delete(url, sermon)
        .success(deferred.resolve)
        .error(deferred.reject)
      ;

      return deferred.promise;
      $rootScope.$broadcast('updateSermon', sermonId)
    };

    return {
      getSermon: getSermon,
      getSermonsForUser: getSermonsForUser,
      getSermonsByQuery: getSermonsByQuery,
      getSermonsForUserNoAuth: getSermonsForUserNoAuth,
      addSermon: addSermon,
      updateSermon: updateSermon,
      removeSermon: removeSermon
    }
  })
;
