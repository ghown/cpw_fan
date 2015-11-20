(function() {
	'use strict';

	var app = angular.module('myApp', ['ngRoute']);
	
	app.config(['$routeProvider', function($routeProvider) {

		$routeProvider
			.when('/', {
				templateUrl: 'welcome.html',
				controller: 'WelcomeCtrl'
			})
			.when('/login', {
				templateUrl: 'login.html'
			})
			.otherwise({
				redirectTo: '/'
			});
	}]);
	
	app.run(['$injector', function($injector) {
		var $rootScope = $injector.get('$rootScope');
		var $location = $injector.get('$location');
		var $http = $injector.get('$http');
		$rootScope.state = 'not logged';
		$rootScope.user = {};
		
		$rootScope.check = function() {
			$http({
				method: 'GET',
				url: '/ws/sandbox/authenticate/check'
			}).then(function(response) {
				console.log('response', response);
				$rootScope.state = 'logged';
				$rootScope.user = response.data.user;
			}).catch(function(error) {
				console.log('not logged', error);
				$location.path('/login');
			});
		};
		$rootScope.check();
		
		
		
		
		$rootScope.login = function() {
			console.log('login');
			console.log('$rootScope.user', $rootScope.user);
			
			$http({
				method: 'POST',
				url: '/ws/sandbox/authenticate',
				data: $rootScope.user
			}).then(function(response) {
				$rootScope.state = 'logged';
				$rootScope.user = response.data.user;
				$location.path('/');
			}).catch(function(error) {
				$rootScope.errorMessage = 'error';
				console.log('Error', error);
			});
		};
		
		$rootScope.logout = function() {
			console.log('logout');
			console.log('$rootScope.user', $rootScope.user);
			
			$http({
				method: 'GET',
				url: '/ws/sandbox/authenticate/logout'
			}).then(function(response) {
				$rootScope.state = 'not logged';
				$rootScope.user.name = undefined;
				$rootScope.user.password = undefined;
				$location.path('/login');
			}).catch(function(error) {
				$rootScope.errorMessage = 'error';
				console.log('Error', error);
				$rootScope.state = 'not logged';
				$rootScope.user.name = undefined;
				$rootScope.user.password = undefined;
				$location.path('/login');
			});
		};
	}]);
	
	app.controller('WelcomeCtrl', ['$injector', function($injector) {
		var $rootScope = $injector.get('$rootScope');
		var $location = $injector.get('$location');
		
		if ($rootScope.state != 'logged') {
			$rootScope.check();
			return;
		}
	}]);
})();
