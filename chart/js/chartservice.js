var chartApp = angular.module('ChartApp');


chartApp.service('ChartService', ['$http', function($http) {
	return {
		// initialize chart object
		initChart: function (title) {
			return {
				title: title,
				total: '',
				unit: '',
				usage: [],
				show: false,
				options: {
					pointHitDetectionRadius: 5,
   					maintainAspectRatio: false
				}
			}
		},
		// fetch chart data from the web api
		getData: function(component, timespan, interval) {
			return $http.get('/api/' + component + '/' + timespan + '/' + interval)
				.then(function(result) {
					return result.data;
				});
		},

		// calculate chart labels
		calcLabel: function(timespan, interval) {
			var label, endTime, amount, populateLabel, sanitize;
			amount = timespan.inMin/interval.inMin || 0;

			// convert labels to correct format
			populateLabel = function (last, timeFormat) {
				var labelTemp = [];
				endTime = moment().startOf(last);
				labelTemp.push(endTime.format(timeFormat));
				for (i = 0; i < amount; i ++) {
					endTime = endTime.subtract(interval.inMin, 'minutes');
					labelTemp.push(endTime.format(timeFormat));
				}
				return labelTemp.reverse();
			};

			// delete consecutively repeating labels
			sanitize = function(labelChart) {

				var temp;

				if (labelChart.length > 0) { 
					temp = labelChart[0];
					for (i = 1; i < labelChart.length; i++) {
						if (labelChart[i] === temp) {
							labelChart[i] = '';
						} else {
							temp = labelChart[i];
						}
					}
				}
				return labelChart;
			};

			// use a switch here in case more timespan are added in the future
			switch(timespan.value) {
				case 'week':
					label = populateLabel('day', 'MM/DD');
					break;
				case 'day':
					label = populateLabel('hour', 'HH:mm');
					break;
				case 'hour':
					label = populateLabel('hour', 'HH:mm');
					break;
				default: 
			}

			return sanitize(label);
		}
	}
}]);