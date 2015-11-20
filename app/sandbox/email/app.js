(function() {
	'use strict';

	var app = angular.module('myApp', []);

	app.run(['$injector', function($injector) {
		var $http = $injector.get('$http');
		var $rootScope = $injector.get('$rootScope');
		
		$rootScope.sendEmail = function () {
			console.log('sendEmail');
			$rootScope.message = 'sending...';
			$http({
				method: 'POST',
				url: '/ws/sandbox/email',
				data: {to: $rootScope.mailTo}
			}).then(function(response) {
				$rootScope.message = response.data;
				console.log('email send');
			}).catch(function(error) {
				$rootScope.message = 'error';
				console.log('mailError', error);
			});
		};
		
	}]);
})();
