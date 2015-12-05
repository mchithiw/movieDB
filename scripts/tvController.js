app.controller("tvController", function($scope, $http, $sce, $routeParams, $location) {
    
    $scope.id = $routeParams.id;
    $scope.loadingImg = true;
    $scope.starImg = "content/images/star.png";
    $scope.apiKey = "64635f806db81dc7134381831cdfa427";
    $scope.posterBase = "http://image.tmdb.org/t/p/";
    $scope.smallImgSize = "w92";
    $scope.mediumImgSize = "w185";
    $scope.largeImgSize = "w342";
    $scope.backdropImgSize = "w1280";
    $scope.inFavorites = false;
    $scope.favoriteButton = "Add to Favorites";
    
    var fav = localStorage.getItem("favorites");
            
            if (fav === "" ||fav === null || typeof fav === "undefined")
                fav = [];
            else
                fav = JSON.parse(fav);
    
    angular.forEach(fav, function(value, key) {
       
        if (value.id == $scope.id)
        {
            $scope.inFavorites = true;
            $scope.favoriteButton = "Added to Favorites";
            return false;
        }
        
    });
    
    $scope.addToFavorites = function() {

            var favList = localStorage.getItem("favorites");
            
            if (favList === "" ||favList === null || typeof favList === "undefined")
                favList = [];
            else
                favList = JSON.parse(favList);
            
            console.log(favList);
            
            favList.push($scope.show);
            
            console.log(favList);
            
            localStorage.setItem("favorites", JSON.stringify(favList));
            
            $scope.inFavorites = true; 
            $scope.favoriteButton = "Added to Favorites";

        
    }
        

    var url = "https://api.themoviedb.org/3/tv/" + $scope.id + "?api_key=" + $scope.apiKey + "&append_to_response=external_ids,videos&callback=JSON_CALLBACK";
    
    
    $http.jsonp(url)
    .then(function(response) {
        
        $scope.show = response.data;
        
        $scope.show.imdb_id = response.data.external_ids.imdb_id;
        
        setImg();
        ratings();
        
        console.log(response.data);
        
        if (response.data.videos.results.length > 0)
        {
            $scope.show.source = "http://www.youtube.com/embed/" +                response.data.videos.results[0].key;
        
        $scope.show.source = $sce.trustAsResourceUrl($scope.show.source);
        
        console.log($scope.show.source);
            
        }
        
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