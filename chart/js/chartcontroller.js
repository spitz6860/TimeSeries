var chartApp = angular.module('chartApp', ['chart.js']);


chartApp.controller('chartController', function($scope, chartService) {
	var shown, timespan, intervalOpt;

	$scope.sysComponent = [
		{label: 'CPU', value: 'cpu', checked: false}, 
		{label: 'HDD', value: 'hdd', checked: false},
		{label: 'Memory', value: 'memory', checked: false},  
		{label: 'Network', value: 'network', checked: false}
	];

	$scope.timespanOpt = [
		{label: 'Week', value: 'week', inMin: 10080}, 
		{label: 'Day', value: 'day', inMin: 1440},
		{label: 'Hour', value: 'hour', inMin: 60}
	];

	$scope.timespan = $scope.timespanOpt[0];
	
	$scope.updateInterval = function(timespan) {
		switch(timespan.value) {
			case 'week': 
				intervalOpt = [
					{label: '24 Hours', value: '24h', inMin: 1440}, 
					{label: '12 Hours', value: '12h', inMin: 720}, 
					{label: '6 Hours', value: '6h', inMin: 360}	
				];
				break;
			case 'day':
				intervalOpt = [
					{label: '4 Hours', value: '4h', inMin: 240}, 
					{label: '2 Hours', value: '2h', inMin: 120}, 
					{label: '1 Hour', value: '1h', inMin: 60}				
				];
				break;
			case 'hour':
				intervalOpt = [
					{label: '10 Minutes', value: '10m', inMin: 10}, 
					{label: '5 Minutes', value: '5m', inMin: 5}, 
					{label: '2 Minute', value: '2m', inMin: 2}			
				];
				break;
			default: 
				// no default
		}

		$scope.intervalOpt = intervalOpt;
		$scope.interval = $scope.intervalOpt[0];
	};


	$scope.labelChart = [];
	$scope.dataChart = {
		'cpu': {
			title: 'CPU',
			total: '',
			unit: '',
			usage: [],
			show: false
		},
		'hdd': {
			title: 'HDD',
			total: '',
			unit: '',
			usage: [],
			show: false
		},
		'memory': {
			title: 'Memory',
			total: '',
			unit: '',
			usage: [],
			show: false
		},
		'network': {
			title: 'Network',
			total: '',
			unit: '',
			usage: [],
			show: false
		}	
	};


	$scope.fetchData = function() {
		var shownComp = [];
		$.each($scope.sysComponent, function() {
			$scope.dataChart[this.value].show = false;
			if (this.checked) {
				shownComp.push(this.value);
			}
		});

		$.each(shownComp, function(index, comp) {
			chartService.getData(comp, $scope.timespan.value, $scope.interval.value).then(function(res){
				$scope.dataChart[comp].total = res.Total;
				$scope.dataChart[comp].unit = res.Unit;
				$scope.dataChart[comp].usage[0] = res.UsageData;
				$scope.dataChart[comp].show = true;
			});
		});
		

		$scope.labelChart = chartService.calcLabel($scope.timespan, $scope.interval);
		console.log($scope);
	}

});