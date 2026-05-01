(function(){
  angular.module('dmsApp').controller('DashboardCtrl', ['$scope','API','$timeout', function($scope,API,$timeout){
    $scope.stats = { total: 0, users: 0, recent: [] }
    $scope.loading = true
    var chartInstance = null

    function load(){
      $scope.loading = true
      API.stats().then(function(data){
        $scope.stats = data
        $timeout(renderChart, 0)
      }).catch(function(){
        // silent — page still renders with zeros
      }).finally(function(){
        $scope.loading = false
      })
    }

    function renderChart(){
      try{
        var ctx = document.getElementById('uploadChart')
        if (!ctx) return
        if (chartInstance) chartInstance.destroy()

        // Group recent docs by date — uploads per day
        var countByDay = {}
        $scope.stats.recent.forEach(function(r){
          var day = new Date(r.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })
          countByDay[day] = (countByDay[day] || 0) + 1
        })

        var labels = Object.keys(countByDay)
        var data   = labels.map(function(d){ return countByDay[d] })

        // Pad to at least 5 bars so the chart doesn't look like one giant block
        if (labels.length === 0) {
          labels = ['No data']
          data   = [0]
        }

        var maxVal = Math.max.apply(null, data) || 1

        chartInstance = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: labels,
            datasets: [{
              label: 'Uploads',
              data: data,
              backgroundColor: '#4f6ef7',
              hoverBackgroundColor: '#3b5bdb',
              borderWidth: 0,
              borderRadius: 5,
              borderSkipped: false,
              maxBarThickness: 48   // prevents bars from becoming huge when few data points
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
              legend: { display: false },
              tooltip: {
                callbacks: {
                  title: function(items){ return items[0].label },
                  label: function(ctx){
                    var v = ctx.parsed.y
                    return '  ' + v + (v === 1 ? ' upload' : ' uploads')
                  }
                },
                backgroundColor: '#0f1829',
                titleColor: '#e2e8f0',
                bodyColor: '#a5b4fc',
                borderColor: '#1e2f47',
                borderWidth: 1,
                padding: 10,
                cornerRadius: 8,
                displayColors: false
              }
            },
            scales: {
              x: {
                grid: { display: false },
                ticks: { color: '#64748b', font: { size: 11 } },
                border: { display: false }
              },
              y: {
                beginAtZero: true,
                max: maxVal + 1,
                ticks: {
                  color: '#64748b',
                  font: { size: 11 },
                  stepSize: 1,
                  precision: 0
                },
                grid: { color: 'rgba(255,255,255,0.04)' },
                border: { display: false }
              }
            }
          }
        })
      }catch(e){ console.error('Chart error', e) }
    }

    load()
  }])
})();
