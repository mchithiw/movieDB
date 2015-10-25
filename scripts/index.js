
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

app.controller("homeController", function($scope, $location, $http) {
    $(".bg").css("background-image", "none");
    $(".header").css("background-color", "black");
    
    
    $scope.apiKey = "64635f806db81dc7134381831cdfa427";
    $scope.posterBase = "http://image.tmdb.org/t/p/";
    $scope.smallImgSize = "w92";
    $scope.mediumImgSize = "w185";
    $scope.largeImgSize = "w342";
    $scope.backdropImgSize = "w1280";
    $scope.loadingImg = true;

    var apiKey = $scope.apiKey;
        
    var url = "https://api.themoviedb.org/3/movie/popular?&api_key=" + apiKey + "&callback=JSON_CALLBACK";
    
    
    $http.jsonp(url)
    .then(function(response) {
        
        if (response.data.results.length > 9)
            var popularMovies = response.data.results.slice(0, 9); 
        else
            var popularMovies = response.data.results;
        
        angular.forEach(popularMovies, function(value, key) {
            
            setImg(value);
            
        });
        
        /*var backdrop = popularMovies[0].backdrop_path;
        
        var backdropUrl = $scope.posterBase + $scope.backdropImgSize + backdrop;
        
            $('.bg').css("background-image", "url(" + backdropUrl + ")", "");
            $(".bg").css("background-size", "contain");
            $(".bg").css("background-repeat", "repeat-y");
            $(".header").css("background-color", "transparent");*/
        
        
        $scope.popular = popularMovies;
        
        $scope.loadingImg = false;
        
    });
    
    function setImg(value)
    {
        var temp = value.backdrop_path;
                
            if (temp === null)
                var img = "content/images/noposter.png";
            else
                var img = $scope.posterBase + $scope.backdropImgSize + temp;              
            value.poster_path = img;
    }
    
    $scope.singlePage = function(media, id)
    {
        var url= '/' + media + '/' + id;
        
        console.log(url);
        
        $location.path(url);
    }
    
    var urlPlaying = "https://api.themoviedb.org/3/movie/now_playing?&api_key=" + apiKey + "&callback=JSON_CALLBACK";
    
    $http.jsonp(urlPlaying)
    .then(function(response) {
        
        if (response.data.results.length > 10)
            var playingMovies = response.data.results.slice(0, 10); 
        else
            var playingMovies = response.data.results;
        
        angular.forEach(playingMovies, function(value, key) {
            
            setImg(value);
            
        });        
        
        $scope.playing = playingMovies;
        
        $scope.loadingImg = false;
        
        $(".popular-box").slick({
            arrows: false,
            autoplay: true
        });
        
    });
    
    
    
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


