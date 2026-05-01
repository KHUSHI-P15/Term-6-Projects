(function(){
  angular.module('dmsApp').controller('UploadCtrl', ['$scope','API','Toast','$location', function($scope,API,Toast,$location){
    $scope.form = { title: '', tags: '', file: null }
    $scope.uploading = false

    $scope.upload = function(){
      if (!$scope.form.file) {
        Toast.show('Select a file before uploading', 'error')
        return
      }
      var fd = new FormData()
      fd.append('file', $scope.form.file)
      fd.append('title', $scope.form.title)
      fd.append('tags', $scope.form.tags)

      $scope.uploading = true
      API.upload(fd).then(function(){
        Toast.show('Uploaded successfully', 'success')
        $scope.form = { title: '', tags: '', file: null }
        $location.path('/documents')
      }).catch(function(err){
        var msg = (err.data && err.data.message) || 'Upload failed'
        Toast.show(msg, 'error')
      }).finally(function(){
        $scope.uploading = false
      })
    }
  }])
})();
