
var app = angular.module("myApp", ['ngRoute']);

app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
	$routeProvider
	.when('/results/:query', {
		templateUrl: 'results.html',
		controller: 'resultsController',
	})
    .when('/movie/:id', {
        templateUrl: 'movie.html',
        controller: 'movieController',
    })
    .when('/tv/:id', {
        templateUrl: 'tv.html',
        controller: 'tvController',
    })
    .when('/empty', {
        templateUrl: 'empty.html',
        controller: 'emptyController',
    })
	.otherwise({redirectTo: '/'});

}]);


app.controller("mainController", function($scope, $http, $location) {

    $scope.getResults = function()
    {
        var temp = $scope.search;
        
        if (typeof temp === 'undefined')
        {
            $location.path('/empty');
            return;
        }
        
        temp = temp.replace(" ", "+");
        var url = '/results/' + temp;
        
        $scope.search = "";

        $location.path(url);
    }
});

app.controller("emptyController", function($scope) {
    
    //$scope.img = "content/images/oops.jpg";

});


