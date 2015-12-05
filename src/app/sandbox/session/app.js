(function() {
	'use strict';

	var app = angular.module('myApp', []);

	app.run(['$injector', function($injector) {
		var $http = $injector.get('$http');
		var $rootScope = $injector.get('$rootScope');
		
		$rootScope.increment = function() {
			$http({
				method: 'GET',
				url: '/ws/sandbox/session'				
			}).then(function(response) {
				$rootScope.sessionCounter = response.data.sessionCounter;
			}).catch(function(error) {
				$rootScope.sessionCounter = 'error';
				console.log('Error', error);
			});
		};
	}]);
})();
