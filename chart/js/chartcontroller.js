var chartApp = angular.module('ChartApp', ['chart.js']);


chartApp.controller('ChartController', function($scope, ChartService) {
	var shown, timespan, intervalOpt;

	// system component checkboxes
	$scope.sysComponent = [
		{label: 'CPU', value: 'cpu', checked: true}, 
		{label: 'HDD', value: 'hdd', checked: true},
		{label: 'Memory', value: 'memory', checked: true},  
		{label: 'Network', value: 'network', checked: true}
	];

	// timespan selector
	$scope.timespanOpt = [
		{label: 'Week', value: 'week', inMin: 10080}, 
		{label: 'Day', value: 'day', inMin: 1440},
		{label: 'Hour', value: 'hour', inMin: 60}
	];

	$scope.timespan = $scope.timespanOpt[0];
	

	// update the interval selector based on what timespan is selected 
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
	$scope.dataChart = {};

	$.each($scope.sysComponent, function() {
		$scope.dataChart[this.value] = ChartService.initChart(this.label);
	});

	$scope.chartOptions = {};

	// fetch data for all the charts that need to be shown
	$scope.fetchData = function() {

		var shownComp;
		shownComp = [];

		$.each($scope.sysComponent, function() {
			$scope.dataChart[this.value].show = false;
			if (this.checked) {
				shownComp.push(this.value);
			}
		});

		$.each(shownComp, function(index, comp) {
			ChartService.getData(comp, $scope.timespan.value, $scope.interval.value).then(function(res){
				$scope.dataChart[comp].total = res.Total;
				$scope.dataChart[comp].unit = res.Unit;
				$scope.dataChart[comp].usage[0] = res.UsageData;
				$scope.dataChart[comp].show = true;
				$scope.dataChart[comp].options.tooltipTemplate = "<%= value %> " + res.Unit;
			});
		});
		

		labelChart = ChartService.calcLabel($scope.timespan, $scope.interval);

		$scope.labelChart = labelChart;
	}
});