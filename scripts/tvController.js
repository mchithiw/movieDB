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
        

    var url = "https://api.themoviedb.org/3/tv/" + $scope.id + "?api_key=" + $scope.apiKey + "&callback=JSON_CALLBACK";
    
    
    $http.jsonp(url)
    .then(function(response) {
        
        $scope.show = response.data;
        
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
    }


});