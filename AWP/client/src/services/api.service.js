(function(){
  angular.module('dmsApp').service('API', ['$http', function($http){
    // Empty base = use Vite proxy in dev; set window.__API_BASE__ for production
    const base = window.__API_BASE__ || ''
    this.login = (data)=> $http.post(base + '/api/auth/login', data).then(r=>r.data)
    this.register = (data)=> $http.post(base + '/api/auth/register', data).then(r=>r.data)
    this.getDocs = (q)=> $http.get(base + '/api/documents', { params: { q } }).then(r=>r.data)
    this.upload = (formData)=> $http.post(base + '/api/documents/upload', formData, { headers: {'Content-Type': undefined}, transformRequest: angular.identity }).then(r=>r.data)
    this.updateDoc = (id, payload)=> $http.put(base + '/api/documents/' + id, payload).then(r=>r.data)
    this.deleteDoc = (id)=> $http.delete(base + '/api/documents/' + id).then(r=>r.data)
    this.users = ()=> $http.get(base + '/api/users').then(r=>r.data)
    this.changeRole = (id, role)=> $http.post(base + '/api/users/' + id + '/role', { role }).then(r=>r.data)
    this.stats = ()=> $http.get(base + '/api/stats').then(r=>r.data)
    this.reportsOverview = ()=> $http.get(base + '/api/reports/overview').then(r=>r.data)
    this.fileUrl = (url)=> base + url
  }])
})();
