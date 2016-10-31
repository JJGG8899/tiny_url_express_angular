angular.module("tinyUrlApp")
  .controller("homeController", ["$scope","$http","$location", function($scope, $http,$location ){
    $scope.submit = function(){
      // console.log("button clicked");
      $http.post("/api/v1/urls",{
        longUrl: $scope.longUrl
      }).success(function(data){
        $location.path('/urls/' + data.shortUrl);
      });
    }
  }]);
