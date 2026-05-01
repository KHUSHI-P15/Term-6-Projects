(function(){
  angular.module('dmsApp').controller('ReportsCtrl', ['$scope','API','$timeout','Toast', function($scope,API,$timeout,Toast){
    var uploadsChart = null
    var tagsChart = null

    function load(){
      API.reportsOverview().then(function(data){
        $timeout(function(){
          renderUploads(data.uploadsByDay || {})
          renderTags(data.tagsBreakdown || {})
        }, 0)
      }).catch(function(){
        Toast.show('Failed to load reports', 'error')
      })
    }

    function renderUploads(map){
      var ctx = document.getElementById('reportsUploadsChart')
      if (!ctx) return
      if (uploadsChart) uploadsChart.destroy()
      var labels = Object.keys(map)
      var values = labels.map(function(k){ return map[k] })
      uploadsChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [{
            label: 'Uploads',
            data: values,
            borderColor: '#6366f1',
            backgroundColor: 'rgba(99,102,241,0.14)',
            fill: true,
            tension: 0.3,
            pointBackgroundColor: '#6366f1',
            pointRadius: 4
          }]
        },
        options: {
          responsive: true,
          plugins: { legend: { display: false } },
          scales: {
            x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#64748b', font: { size: 11 } } },
            y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#64748b', font: { size: 11 } } }
          }
        }
      })
    }

    function renderTags(map){
      var ctx = document.getElementById('reportsTagsChart')
      if (!ctx) return
      if (tagsChart) tagsChart.destroy()
      var labels = Object.keys(map)
      var values = labels.map(function(k){ return map[k] })
      tagsChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: labels,
          datasets: [{
            data: values,
            backgroundColor: ['#6366f1','#06b6d4','#8b5cf6','#10b981','#f59e0b','#ef4444'],
            borderColor: '#131f33',
            borderWidth: 2
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: { labels: { color: '#94a3b8', font: { size: 12 } } }
          }
        }
      })
    }

    load()
  }])
})();
