(function() {
	'use strict';

	var app = angular.module('myApp', ['ui.router', 'ry.group']);
	
	app.config(['$locationProvider', '$stateProvider', '$urlRouterProvider', function($locationProvider, $stateProvider, $urlRouterProvider) {
	
		$locationProvider
			.html5Mode(true)
			.hashPrefix('!');

		$urlRouterProvider.otherwise('/');

		$stateProvider.state('home', {
			url: '/',
			templateUrl: 'home.html'
		});
	}]);
	
	app.run(['$injector', function($injector) {
		var $http = $injector.get('$http');
		var $rootScope = $injector.get('$rootScope');
		var $window = $injector.get('$window');
		var $state = $injector.get('$state');
		var $stateParams = $injector.get('$stateParams');
		var ngDialog = $injector.get('ngDialog');
		
		$rootScope.$state = $state;
		$rootScope.$stateParams = $stateParams; 
		
		$rootScope.error = {};
		
		$rootScope.$on('$stateChangeStart', function() {
			$rootScope.error = {};
		});
		

		
		// User functions
		$rootScope.resetDB = function() {
			$rootScope.error.resetDB = undefined;
			console.log('resetDB');
			$http({
				method: 'GET',
				url: '/ws/sandbox/user/resetDB'
			}).then(function(response) {
				console.log('resetDB ok');
			}).catch(function(error) {
				console.error('Error', error);
				$rootScope.error.resetDB = 'error: ' + error.data.message;
			});
		};
		

	}]);

	app.directive('sbHeader', function() {
		return {
			restrict: 'EAC',
			templateUrl: 'header.html',
			transclude: true
		};
	});
	
	app.directive('sbFooter', function() {
		return {
			restrict: 'EAC',
			templateUrl: 'footer.html',
			transclude: true
		};
	});
	
})();
