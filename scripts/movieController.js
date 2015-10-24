app.controller("movieController", function($scope, $http, $routeParams, $location) {
    
    $scope.id = $routeParams.id;
    $scope.loadingImg = true;
    $scope.starImg = "content/images/star.png";
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
        
        setImg();
        ratings();
        
        $scope.loadingImg = false;
        
    }, function() {

        $location.path('/');
        
    });
    
    
    function setImg()
    {
        var temp = $scope.movie.poster_path;
        
        if (temp === null)
            var img = "content/images/noposter.png";
        else
            var img = $scope.posterBase + $scope.largeImgSize + temp;
                
        $scope.movie.poster_path = img;
        
        if ($scope.movie.backdrop_path)
        {
            
            var imgBackground = $scope.posterBase + $scope.backdropImgSize + $scope.movie.backdrop_path;
            
            $scope.movie.backdrop_path = imgBackground;
        
            $('.bg').css("background-image", "url(" + imgBackground + ")", "");
            $(".header").css("background-color", "transparent");
            
        } else 
            $(".bg").css("background-image", "none");
        
    }
    
    function ratings()
    {
        var value = $scope.movie;
        
        var ratingNum = Math.floor(value.vote_average);
        
        var ratingDec = value.vote_average % 1;
        ratingDec = (Math.round(ratingDec * 2) / 2).toFixed(2);
        
        var imdbID = value.imdb_id;
        
        if (typeof imdbID !== "undefined")
        {
            var omdbUrl = "http://www.omdbapi.com/?i=" + imdbID + "&callback=JSON_CALLBACK";
            
            $http.jsonp(omdbUrl)
            .then(function(response) {
                
                console.log(response.data);
                ratingNum = Math.floor(response.data.imdbRating);
                ratingDec = (Math.round(response.data.imdbRating * 2) / 2).toFixed(2);
                
                $scope.movie.vote_average = response.data.imdbRating;
                $scope.movie.vote_count = response.data.imdbVotes;
                
            });
        }
                
        if (ratingNum === 0)
        {
            value.rating = false;
            value.noRating = true;
        } else
            value.rating = true;   
        
        
        if (Math.round(ratingDec) === 1)
        {
            value.halfStar = true;
        }
        
        var arr = [];
    
        for (var i = 0; i < ratingNum; i++) {
            arr[i] = i;
        }
        
        value.starArr = arr;
    }
    

});