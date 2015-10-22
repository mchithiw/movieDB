
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

app.controller("resultsController", function($scope, $http, $location, $routeParams) {

    $scope.apiKey = "64635f806db81dc7134381831cdfa427";
    $scope.posterBase = "http://image.tmdb.org/t/p/";
    $scope.smallImgSize = "w92";
    $scope.mediumImgSize = "w185";
    $scope.largeImgSize = "w342";
    $scope.backdropImgSize = "w1280";

		var search = $routeParams.query.replace(" ", "+");
        var apiKey = $scope.apiKey;
        

		var url = "https://api.themoviedb.org/3/search/multi?query=" + search + "&api_key=" + apiKey + "&callback=JSON_CALLBACK";
        
        $http.jsonp(url)
        .then(function(response) {
            
            var i = response.data.results.length;
            
            if (i === 0)
            {
                $location.path('/empty');
            }
            
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
                
                var ratingNum = Math.floor(value.vote_average);
                
                if (ratingNum === 0)
                {
                    value.rating = false;
                    value.noRating = true;
                } else
                    value.rating = true;
                
                
                var ratingDec = value.vote_average % 1;
                ratingDec = (Math.round(ratingDec * 2) / 2).toFixed(2);
                if (Math.round(ratingDec) === 1)
                {
                    value.halfStar = true;
                }
                
                var arr = [];
            
                for (var i = 0; i < ratingNum; i++) {
                    arr[i] = i;
                }
                
                value.starArr = arr;
                
            });
            
            $scope.starImg = "content/images/star.png";
            
            $scope.results = response.data.results;
            
        });

    
    $scope.singlePage = function(media, id)
    {
        var url= '/' + media + '/' + id;
        
        $location.path(url);
    }
});

app.controller("movieController", function($scope, $http, $routeParams) {
    
    $scope.id = $routeParams.id;
    
    $scope.apiKey = "64635f806db81dc7134381831cdfa427";
    $scope.posterBase = "http://image.tmdb.org/t/p/";
    $scope.smallImgSize = "w92";
    $scope.mediumImgSize = "w185";
    $scope.largeImgSize = "w342";
    $scope.backdropImgSize = "w1280";
        

    var url = "https://api.themoviedb.org/3/movie/" + $scope.id + "?api_key=" + $scope.apiKey + "&callback=JSON_CALLBACK";
    
    $http.jsonp(url)
    .then(function(response) {  
        $scope.movie = response.data;
        var value = $scope.movie;
        
        var temp = value.poster_path;
                
                if (temp === null)
                    var img = "content/images/noposter.png";
                else
                    var img = $scope.posterBase + $scope.largeImgSize + temp;
                
                value.poster_path = img;
        
                if (value.backdrop_path)
                {
                    var img = $scope.posterBase + $scope.backdropImgSize + value.backdrop_path;
                    
                    value.backdrop_path = img;
                
                    //$('.bg').css("background-image", "url(" + img + ")", "");
                    
                }
                
                var ratingNum = Math.floor(value.vote_average);
                
                if (ratingNum === 0)
                {
                    value.rating = false;
                    value.noRating = true;
                } else
                    value.rating = true;
                
                
                var ratingDec = value.vote_average % 1;
                ratingDec = (Math.round(ratingDec * 2) / 2).toFixed(2);
                if (Math.round(ratingDec) === 1)
                {
                    value.halfStar = true;
                }
                
                var arr = [];
            
                for (var i = 0; i < ratingNum; i++) {
                    arr[i] = i;
                }
                
                value.starArr = arr;
            
            $scope.starImg = "content/images/star.png";
    });
    
    
    
    

});


app.controller("tvController", function($scope, $http, $routeParams) {
    
    $scope.id = $routeParams.id;

});

app.controller("emptyController", function($scope) {
    
    //$scope.img = "content/images/oops.jpg";

});


