
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
    .when('/', {
        templateUrl: 'home.html',
        controller: 'homeController',
    })
	.otherwise({redirectTo: '/'});

}]);

app.controller("homeController", function($scope, $location) {
    $(".bg").css("background-image", "none");
    $(".header").css("background-color", "black");
});

app.controller("mainController", function($scope, $http, $location) {

    $scope.getResults = function()
    {
        var temp = $scope.search;
        
        if (typeof temp === 'undefined' || temp === "")
        {
            $location.path('/empty');
            return;
        }
        
        temp = temp.replace(" ", "+");
        var url = '/results/' + temp;
        
        $scope.search = "";

        $location.path(url);
    }
    
    $scope.home = function() 
    {
        $location.path('/');
    }
});

app.controller("emptyController", function($scope) {
    
    //$scope.img = "content/images/oops.jpg";

});


