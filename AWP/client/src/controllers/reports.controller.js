(function(){
  angular.module('dmsApp').controller('ReportsCtrl', ['$scope','API','Toast', function($scope,API,Toast){
    $scope.loading = true
    $scope.summary = { totalUploads: 0, activeDays: 0, distinctTags: 0 }
    $scope.uploadsByDay = []
    $scope.tagsBreakdown = []

    function load(){
      API.reportsOverview().then(function(data){
        var uploadsMap = data.uploadsByDay || {}
        var tagsMap = data.tagsBreakdown || {}

        $scope.uploadsByDay = Object.keys(uploadsMap)
          .sort()
          .map(function(day){
            return { day: day, count: uploadsMap[day] }
          })

        $scope.tagsBreakdown = Object.keys(tagsMap)
          .map(function(tag){
            return { tag: tag, count: tagsMap[tag] }
          })
          .sort(function(a, b){ return b.count - a.count })

        $scope.summary.totalUploads = $scope.uploadsByDay.reduce(function(sum, item){ return sum + item.count }, 0)
        $scope.summary.activeDays = $scope.uploadsByDay.length
        $scope.summary.distinctTags = $scope.tagsBreakdown.length
      }).catch(function(){
        Toast.show('Failed to load reports', 'error')
      }).finally(function(){
        $scope.loading = false
      })
    }

    load()
  }])
})();
