app.controller("tvController", function($scope, $http, $routeParams, $location) {
    
    $scope.id = $routeParams.id;
    $scope.loadingImg = true;
    $scope.starImg = "content/images/star.png";
    $scope.apiKey = "64635f806db81dc7134381831cdfa427";
    $scope.posterBase = "http://image.tmdb.org/t/p/";
    $scope.smallImgSize = "w92";
    $scope.mediumImgSize = "w185";
    $scope.largeImgSize = "w342";
    $scope.backdropImgSize = "w1280";
        

    var url = "https://api.themoviedb.org/3/tv/" + $scope.id + "?api_key=" + $scope.apiKey + "&append_to_response=external_ids&callback=JSON_CALLBACK";
    
    
    $http.jsonp(url)
    .then(function(response) {
        
        $scope.show = response.data;
        
        $scope.show.imdb_id = response.data.external_ids.imdb_id;
        
        setImg();
        ratings();
        
        $scope.loadingImg = false;
        $scope.show.seasonCount = $scope.show.seasons.length - 1;
        
    }, function() {

        $location.path('/');
        
    });
    
    
    function setImg()
    {
        var temp = $scope.show.poster_path;
        
        if (temp === null)
            var img = "content/images/noposter.png";
        else
            var img = $scope.posterBase + $scope.largeImgSize + temp;
                
        $scope.show.poster_path = img;
        
        if ($scope.show.backdrop_path)
        {
 
            var imgBackground = $scope.posterBase + $scope.backdropImgSize + $scope.show.backdrop_path;
            
            $scope.show.backdrop_path = imgBackground;
        
            $('.bg').css("background-image", "url(" + imgBackground + ")", "");
            $(".header").css("background-color", "transparent");
            
        } else 
            $(".bg").css("background-image", "none");
    }
    
    function ratings()
    {
        var value = $scope.show;
        
        value.rating = false;
        value.noRating = false;
        
        var imdbID = value.imdb_id;
        
        if (typeof imdbID !== "undefined")
        {
            var omdbUrl = "http://www.omdbapi.com/?i=" + imdbID + "&callback=JSON_CALLBACK";
            
            $http.jsonp(omdbUrl)
            .then(function(response) {
                
                ratingNum = Math.floor(response.data.imdbRating);
                ratingDec = response.data.imdbRating - ratingNum;
                
                value.vote_average = response.data.imdbRating;
                value.vote_count = response.data.imdbVotes;
                
                if (ratingNum === 0)
                {
                    value.rating = false;
                    value.noRating = true;
                } 

                if (Math.round(ratingDec) === 1)
                {
                    value.halfStar = true;
                }

                var arr = [];

                for (var i = 0; i < ratingNum; i++) {
                    arr[i] = i;
                }

                value.starArr = arr;
                
                if (response.data.imdbRating !== "N/A" || response.data.imdbVotes !== "N/A")
                {
                    value.rating = true;
                    value.noRating = false;
                }
                
            });
        } else
            value.noRating = true;
        
                
    }


});