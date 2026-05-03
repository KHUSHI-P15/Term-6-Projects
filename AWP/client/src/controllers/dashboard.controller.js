(function(){
  angular.module('dmsApp').controller('DashboardCtrl', ['$scope','API', function($scope,API){
    $scope.stats = { total: 0, users: 0, recent: [] }
    $scope.loading = true

    function load(){
      $scope.loading = true
      API.stats().then(function(data){
        $scope.stats = data
      }).catch(function(){
        // silent — page still renders with zeros
      }).finally(function(){
        $scope.loading = false
      })
    }

    load()
  }])
})();
