app.controller("resultsController", function($scope, $http, $location, $routeParams) {

    $scope.apiKey = "64635f806db81dc7134381831cdfa427";
    $scope.posterBase = "http://image.tmdb.org/t/p/";
    $scope.smallImgSize = "w92";
    $scope.mediumImgSize = "w185";
    $scope.largeImgSize = "w342";
    $scope.backdropImgSize = "w1280";
    $scope.loadingImg = true;

    var search = $routeParams.query.replace(" ", "+");
    var apiKey = $scope.apiKey;
        

		var url = "https://api.themoviedb.org/3/search/multi?query=" + search + "&api_key=" + apiKey + "&callback=JSON_CALLBACK";
    
    
    function setImg(value)
    {
        var temp = value.poster_path;
                
            if (temp === null)
                var img = "content/images/noposter.png";
            else
                var img = $scope.posterBase + $scope.smallImgSize + temp;              
            value.poster_path = img;
    }
    
    function ratings(value) 
    {
        
        var ratingNum = Math.floor(value.vote_average);
        
        var ratingDec = value.vote_average % 1;
        ratingDec = (Math.round(ratingDec * 2) / 2).toFixed(2);
                
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
        
        $http.jsonp(url)
        .then(function(response) {
            
            var i = response.data.results.length;
            
            if (i === 0)
            {
                $location.path('/empty');
            } else
            {
                $(".bg").css("background-image", "none");
                $(".header").css("background-color", "black");
            }
            
            while (i--)
            {
                if (response.data.results[i].media_type === "person")
                    response.data.results.splice(i, 1);
            }
            
            angular.forEach(response.data.results, function(value, key) {
                
                if (value.media_type !== "tv")
                {
                    $http.jsonp("https://api.themoviedb.org/3/movie/" + value.id + "?api_key=" + $scope.apiKey + "&callback=JSON_CALLBACK")
        .then(function(response) {
                value.imdb_id = response.data.imdb_id;
                console.log(value.imdb_id);
                        
                if (typeof value.imdb_id !== "undefined")
                {
                    var omdbUrl = "http://www.omdbapi.com/?i=" + value.imdb_id + "&callback=JSON_CALLBACK";

                    $http.jsonp(omdbUrl)
                    .then(function(response) {

                        value.vote_average = response.data.imdbRating;
                        value.vote_count = response.data.imdbVotes;
                        
                        console.log(value.vote_average);

                    });
                }
                
        });
                }
        
                
                setImg(value);
                ratings(value);
                
                if (value.media_type === "tv")
                    value.original_title = value.original_name;
                
            }); 
            
            $scope.starImg = "content/images/star.png";
            
            $scope.results = response.data.results;
            
            $scope.loadingImg = false;
            
        });

    
    $scope.singlePage = function(media, id)
    {
        var url= '/' + media + '/' + id;
        
        $location.path(url);
    }
    
});