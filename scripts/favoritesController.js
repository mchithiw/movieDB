app.controller("favoritesController", function($scope, $http, $sce, $routeParams, $location) {
    
    $scope.load = function(index) {
        
        var item = $scope.favorites[index];
        
        if (typeof item.original_title !== "undefined")
            $location.path('/movie/' + item.id);
        else
            $location.path('/tv/' + item.id);
    }
    
    $scope.favorites = localStorage.getItem("favorites");
    
    $scope.empty = true;
    
    if ($scope.favorites !== null && $scope.favorites.length > 0)
        $scope.empty = false;
    
    if (!$scope.empty)
        $scope.favorites = JSON.parse($scope.favorites);
    
    console.log($scope.favorites);
    
    $scope.emptyList = function() {
        
        localStorage.removeItem("favorites");
        $scope.favorites = [];
        $scope.empty = true;
    }
    
    
    
});