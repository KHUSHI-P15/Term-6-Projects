(function(){
  const app = angular.module('dmsApp', ['ngRoute'])

  app.config(['$routeProvider', '$httpProvider', '$locationProvider', function($routeProvider, $httpProvider, $locationProvider){
    // Use #/route format so sidebar links and route URLs stay consistent.
    $locationProvider.hashPrefix('')

    $routeProvider
      .when('/login', { templateUrl: 'src/pages/login.html', controller: 'AuthCtrl' })
      .when('/', { templateUrl: 'src/pages/dashboard.html', controller: 'DashboardCtrl' })
      .when('/documents', { templateUrl: 'src/pages/documents.html', controller: 'DocsCtrl' })
      .when('/upload', { templateUrl: 'src/pages/upload.html', controller: 'UploadCtrl' })
      .when('/users', { templateUrl: 'src/pages/users.html', controller: 'UsersCtrl' })
      .when('/reports', { templateUrl: 'src/pages/reports.html', controller: 'ReportsCtrl' })
      .otherwise({ redirectTo: '/login' })

    $httpProvider.interceptors.push(['$q','$location', function($q,$location){
      return {
        request: function(config){
          var token = null
          try { token = localStorage.getItem('token') } catch(e) { token = null }
          if (token) config.headers['Authorization'] = 'Bearer ' + token
          return config
        },
        responseError: function(rejection){
          if (rejection.status === 401) {
            try { localStorage.removeItem('token'); localStorage.removeItem('user') } catch(e){}
            $location.path('/login')
          }
          return $q.reject(rejection)
        }
      }
    }])
  }])

  app.run(['$rootScope','$location', function($rootScope,$location){
    try{
      var __u = null
      try { __u = localStorage.getItem('user') } catch(e) { __u = null }
      $rootScope.currentUser = JSON.parse(__u || 'null')
    }catch(e){ $rootScope.currentUser = null }

    // Root helpers
    $rootScope.logout = function(){ try { localStorage.removeItem('token'); localStorage.removeItem('user') } catch(e){}; $rootScope.currentUser = null; $location.path('/login') }
    $rootScope.searchTimeout = null
    $rootScope.search = function(q){
      if ($rootScope.searchTimeout) clearTimeout($rootScope.searchTimeout)
      $rootScope.searchTimeout = setTimeout(function(){
        $rootScope.$apply(function(){
          $location.path('/documents')
          $location.search('q', q || '')
        })
      }, 350)
    }

    $rootScope.$on('$routeChangeStart', function(event, next){
      const path = (next && next.$$route && next.$$route.originalPath) || ''
      const publicRoute = path === '/login'
      if (!$rootScope.currentUser && !publicRoute) {
        event.preventDefault()
        $location.path('/login')
        return
      }
      if ($rootScope.currentUser && (path === '/users' || path === '/reports') && $rootScope.currentUser.role !== 'admin') {
        event.preventDefault()
        $location.path('/')
      }
    })

    if (!$rootScope.currentUser) $location.path('/login')
  }])

  app.controller('ShellCtrl', ['$scope', '$rootScope', '$location', '$timeout', function($scope, $rootScope, $location, $timeout){
    $scope.sidebarOpen = false
    $scope.searchInput = ''
    $scope.currentUser = $rootScope.currentUser || {}
    // toasts must reference $rootScope.toasts directly — not a snapshot copy
    // The template uses `toasts` which resolves via scope chain to $rootScope.toasts

    $scope.logout = function(){
      $rootScope.logout()
    }

    $scope.search = function(q){
      $rootScope.search(q)
    }

    $scope.isActive = function(path){
      return $location.path() === path
    }

    $scope.breadcrumbs = { section: 'Workspace', page: 'Dashboard' }
    $scope.showAppChrome = !!($scope.currentUser && $scope.currentUser.name) && $location.path() !== '/login'
    $scope.$on('$routeChangeSuccess', function(){
      const p = $location.path() || '/'
      const map = {
        '/': { section: 'Overview', page: 'Dashboard' },
        '/documents': { section: 'Library', page: 'Documents' },
        '/upload': { section: 'Library', page: 'Upload' },
        '/users': { section: 'Admin', page: 'Users' },
        '/reports': { section: 'Admin', page: 'Reports' },
        '/login': { section: 'Auth', page: 'Sign In' }
      }
      $scope.breadcrumbs = map[p] || { section: 'Workspace', page: 'Dashboard' }
      $scope.currentUser = $rootScope.currentUser || {}
      $scope.showAppChrome = !!($scope.currentUser && $scope.currentUser.name) && p !== '/login'
      $scope.sidebarOpen = false
      // Re-render Lucide icons after route change
      $timeout(function(){ if (window.lucide) window.lucide.createIcons() }, 50)
    })

    // Keyboard-friendly shortcuts
    document.addEventListener('keydown', function(e){
      if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes((e.target && e.target.tagName) || '')) {
        e.preventDefault()
        const input = document.querySelector('input[aria-label="Search documents"]')
        if (input) input.focus()
      }
      if (e.key === 'Escape') {
        $scope.$applyAsync(function(){ $scope.sidebarOpen = false })
      }
    })
  }])

  app.directive('fileModel', ['$parse', function ($parse) {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        const model = $parse(attrs.fileModel)
        const modelSetter = model.assign
        element.bind('change', function(){
          scope.$apply(function(){
            modelSetter(scope, element[0].files[0])
          })
        })
      }
    }
  }])

})();
