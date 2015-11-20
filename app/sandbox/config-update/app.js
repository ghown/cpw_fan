(function() {
	'use strict';

	var app = angular.module('myApp', []);

	app.run(['$injector', function($injector) {
		var $http = $injector.get('$http');
		var $rootScope = $injector.get('$rootScope');
		
		$rootScope.list = [];
		
		
		$rootScope.addPair = function() {
			$rootScope.list.push({key: '', value: ''});
		};
		$rootScope.addPair();
		
		$rootScope.removePair = function(i) {
			$rootScope.list.splice(i, 1);
		};
		
		$rootScope.updateConfig = function() {
			$http({
				method: 'POST',
				url: '/ws/sandbox/configMgmt/update',
				data: $rootScope.list
			}).then(function(response) {
				$rootScope.message = response.data;
				console.log('config updated');
			}).catch(function(error) {
				$rootScope.message = 'error';
				console.log('error', error);
			});
		};
		
	}]);
})();
