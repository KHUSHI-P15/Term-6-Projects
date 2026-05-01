(function(){
  angular.module('dmsApp').controller('DocsCtrl', ['$scope','API','Toast','$location', function($scope,API,Toast,$location){
    try{ $scope.view = localStorage.getItem('docView') || 'grid' } catch(e){ $scope.view = 'grid' }
    $scope.documents = []
    $scope.filtered = []
    $scope.loading = true
    $scope.page = 1
    $scope.pageSize = 9
    $scope.sortField = 'createdAt'
    $scope.sortDir = 'desc'
    $scope.editModal = false
    $scope.editForm = { id: '', title: '', tags: '' }

    function applySearchAndSort(items){
      var q = ($location.search().q || '').toLowerCase()
      var out = items
      if (q) {
        out = out.filter(function(d){
          var title = String(d.title || '').toLowerCase()
          var tags  = (d.tags || []).join(' ').toLowerCase()
          return title.includes(q) || tags.includes(q)
        })
      }
      out = out.slice().sort(function(a, b){
        var av = a[$scope.sortField]
        var bv = b[$scope.sortField]
        if (av === bv) return 0
        var r = av > bv ? 1 : -1
        return $scope.sortDir === 'asc' ? r : -r
      })
      $scope.filtered = out
    }

    function load(){
      $scope.loading = true
      API.getDocs($location.search().q || '').then(function(docs){
        $scope.documents = docs
        applySearchAndSort($scope.documents)
        $scope.page = 1
      }).catch(function(){
        Toast.show('Failed to load documents', 'error')
      }).finally(function(){
        $scope.loading = false
      })
    }

    $scope.persistView = function(){ try { localStorage.setItem('docView', $scope.view) } catch(e){} }

    $scope.totalPages = function(){ return Math.max(1, Math.ceil(($scope.filtered.length || 0) / $scope.pageSize)) }
    $scope.pagedDocuments = function(){
      var start = ($scope.page - 1) * $scope.pageSize
      return $scope.filtered.slice(start, start + $scope.pageSize)
    }
    $scope.nextPage = function(){ if ($scope.page < $scope.totalPages()) $scope.page += 1 }
    $scope.prevPage = function(){ if ($scope.page > 1) $scope.page -= 1 }

    $scope.sortBy = function(field){
      if ($scope.sortField === field) $scope.sortDir = $scope.sortDir === 'asc' ? 'desc' : 'asc'
      else { $scope.sortField = field; $scope.sortDir = 'asc' }
      applySearchAndSort($scope.documents)
    }

    $scope.fileUrl = function(d){ return API.fileUrl(d.url) }

    $scope.openEdit = function(d){
      $scope.editForm = { id: d._id, title: d.title, tags: (d.tags || []).join(', ') }
      $scope.editModal = true
    }

    $scope.closeEdit = function(){
      $scope.editModal = false
    }

    $scope.saveEdit = function(){
      API.updateDoc($scope.editForm.id, { title: $scope.editForm.title, tags: $scope.editForm.tags })
        .then(function(){
          $scope.editModal = false
          Toast.show('Document updated', 'success')
          load()
        }).catch(function(){
          Toast.show('Update failed', 'error')
        })
    }

    $scope.remove = function(d){
      if (!confirm('Delete document?')) return
      API.deleteDoc(d._id).then(function(){
        Toast.show('Document deleted', 'success')
        load()
      }).catch(function(){
        Toast.show('Delete failed', 'error')
      })
    }

    $scope.$on('$locationChangeSuccess', function(){
      applySearchAndSort($scope.documents)
      $scope.page = 1
    })

    load()
  }])
})();
