
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
	.otherwise({redirectTo: '/'});

}]);

app.controller("mainController", function($scope, $http, $location) {

    $scope.getResults = function()
    {
        var temp = $scope.search.replace(" ", "+");
        var url = '/results/' + temp;
        
        $scope.search = "";

        $location.path(url);
    }
});

app.controller("resultsController", function($scope, $http, $location, $routeParams) {

    $scope.apiKey = "64635f806db81dc7134381831cdfa427";
    $scope.posterBase = "http://image.tmdb.org/t/p/";
    $scope.smallImgSize = "w154";
    $scope.mediumImgSize = "w185";
    $scope.largeImgSize = "w342";
    $scope.backdropImgSize = "w1280";

		var search = $routeParams.query.replace(" ", "+");
        var apiKey = $scope.apiKey;
        

		var url = "https://api.themoviedb.org/3/search/multi?query=" + search + "&api_key=" + apiKey + "&callback=JSON_CALLBACK";
        
        $http.jsonp(url)
        .then(function(response) {
            
            var i = response.data.results.length;
            
            while (i--)
            {
                if (response.data.results[i].media_type === "person")
                    response.data.results.splice(i, 1);
            }
            
            angular.forEach(response.data.results, function(value, key) {
                var temp = value.poster_path;
                
                if (temp === null)
                    var img = "content/images/noposter.png";
                else
                    var img = $scope.posterBase + $scope.smallImgSize + temp;
                
                value.poster_path = img;
                
                if (value.media_type === "tv")
                    value.original_title = value.original_name;
                    
                
            });
            
            $scope.results = response.data.results;
                
            console.log($scope.results);
            
            //$location.path('/results');
            
        });

    
    $scope.singlePage = function(media, id)
    {
        var url= '/' + media + '/' + id;
        
        $location.path(url);
    }
});

app.controller("movieController", function($scope, $http, $routeParams) {
    
    $scope.id = $routeParams.id;

});

app.controller("tvController", function($scope, $http, $routeParams) {
    
    $scope.id = $routeParams.id;

});


