(function() {
	'use strict';

	var app = angular.module('myApp', ['datePicker']);	
	
	app.run(['$injector', function($injector) {
		var $rootScope = $injector.get('$rootScope');
		
		$rootScope.myDate = '';
		
		$rootScope.$watch('myDate', function() {
			console.log('myDate', $rootScope.myDate);
		});
		
		$rootScope.startDate = new Date();
		$rootScope.endDate = new Date();
	}]);
})();
