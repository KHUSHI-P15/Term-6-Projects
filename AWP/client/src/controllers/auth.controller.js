(function(){
  angular.module('dmsApp').controller('AuthCtrl', ['$scope','API','$location','Toast', function($scope,API,$location,Toast){
    $scope.mode = 'login'
    $scope.form = { name: '', email: '', password: '' }
    $scope.loading = false
    $scope.error = null

    $scope.toggleMode = function(){
      $scope.mode = $scope.mode === 'login' ? 'register' : 'login'
      $scope.error = null
      $scope.showPassword = false
    }

    $scope.submitAuth = function(){
      if ($scope.loading) return
      $scope.error = null

      if ($scope.mode === 'register' && (!$scope.form.password || $scope.form.password.length < 6)) {
        $scope.error = 'Password must be at least 6 characters.'
        return
      }

      const payload = $scope.mode === 'login'
        ? { email: $scope.form.email, password: $scope.form.password }
        : { name: $scope.form.name, email: $scope.form.email, password: $scope.form.password }

      $scope.loading = true
      const req = $scope.mode === 'login' ? API.login(payload) : API.register(payload)

      req.then(function(res){
        try { localStorage.setItem('token', res.token); localStorage.setItem('user', JSON.stringify(res.user)) } catch(e){}
        $scope.$root.currentUser = res.user
        Toast.show($scope.mode === 'login' ? 'Welcome back' : 'Account created', 'success')
        $location.path('/')
      }).catch(function(err){
        $scope.error = (err.data && err.data.message) || 'Authentication failed'
      }).finally(function(){
        $scope.loading = false
      })
    }
  }])
})();
