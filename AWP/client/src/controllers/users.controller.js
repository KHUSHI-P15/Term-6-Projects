(function(){
  angular.module('dmsApp').controller('UsersCtrl', ['$scope','API','Toast', function($scope,API,Toast){
    $scope.users = []
    $scope.loading = true

    $scope.load = function(){
      $scope.loading = true
      API.users().then(function(data){
        $scope.users = data
      }).catch(function(){
        Toast.show('Failed to load users', 'error')
      }).finally(function(){
        $scope.loading = false
      })
    }

    $scope.changeRole = function(u, role){
      API.changeRole(u._id, role).then(function(){
        Toast.show('Role updated', 'success')
        $scope.load()
      }).catch(function(){
        Toast.show('Update failed', 'error')
      })
    }

    $scope.load()
  }])
})();
