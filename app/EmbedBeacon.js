var app = angular.module('embedBeacon', [
  'firebase',
  'kendo.directives',
  'sermonBeacon.components.sermon',
  'sermonBeacon.models.sermons',
  'sermonBeacon.embed'
]);

angular.module('firebase').filter('arrayWithDates', function() {
    // Make sure all the sermons have javascript dates
    return function(input) {
        var list = [];
        if (input) {
            if (input.length > 0) {
                for (var i = 0; i < input.length; i++) {
                    var val = input[i];
                    if (val) {
                        if( val.date ) {
                            // Use javascript date for filtering purposes only...keep the real date ISO
                            // for displaying
                            val.fakeDate = new Date(val.date);
                        }
                        list.push(val);
                    }
                }
            }
        }
        return list
    };
});

app.constant('URI', 'http://sbapiprod-30386.onmodulus.net/api/');
