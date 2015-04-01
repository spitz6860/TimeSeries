var chartApp = angular.module('chartApp');

chartApp.service('chartService', ['$http', function($http) {
	return {

		getData: function(component, timespan, interval) {
			return $http.get('/api/' + component + '/' + timespan + '/' + interval)
				.then(function(result) {
					return result.data;
				});

		},
		calcLabel: function(timespan, interval) {
			var label, endTime, amount, populateLabel;
			amount = timespan.inMin/interval.inMin || 0;

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
			switch(timespan.value) {
				case 'week':
					label = populateLabel('day', 'MM-DD HH:mm');
					break;
				case 'day':
					label = populateLabel('hour', 'HH:mm');
					break;
				case 'hour':
					label = populateLabel('hour', 'HH:mm');
					break;
				default: 
			}
			return label;
		}
	}
}]);