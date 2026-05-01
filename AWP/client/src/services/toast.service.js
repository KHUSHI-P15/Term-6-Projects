(function(){
  angular.module('dmsApp').service('Toast', ['$rootScope','$timeout', function($rootScope,$timeout){
    $rootScope.toasts = $rootScope.toasts || []
    this.show = function(msg, type='info', timeout=3000){
      const t = { id: Date.now()+Math.random(), msg, type }
      $rootScope.toasts.push(t)
      $timeout(()=>{ const idx = $rootScope.toasts.findIndex(x=>x.id===t.id); if(idx>-1) $rootScope.toasts.splice(idx,1) }, timeout)
    }
  }])
})();
