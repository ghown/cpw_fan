(function() {
	'use strict';

	var app = angular.module('myApp', ['ui.router', 'ngDialog', 'ry.user']);
	
	app.config(['$locationProvider', '$stateProvider', '$urlRouterProvider', function($locationProvider, $stateProvider, $urlRouterProvider) {
	
		$locationProvider
			.html5Mode(true)
			.hashPrefix('!');

		$urlRouterProvider.otherwise('/');

		$stateProvider.state('home', {
			url: '/',
			templateUrl: 'home.html'
		}).state('createGroup', {
			url: '/createGroup',
			templateUrl: 'createGroup.html'
		}).state('createGroup.form', {
			url: '/',
			templateUrl: 'createGroup.form.html'
		}).state('createGroup.success', {
			url: '/',
			templateUrl: 'createGroup.success.html'
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
		
		

		$rootScope.getUserGroup = function() {
			console.log('getUserGroup');
			$rootScope.userGroup = undefined;
			$http({
				method: 'POST',
				url: '/ws/sandbox/userGroup/getGroup',
				data: $rootScope.user._id
			}).then(function(response) {
				console.log('getGroup ok');
				$rootScope.userGroup = response.data;
			}).catch(function(error) {
				if (error.status != 401) {
					console.error('Error', error);
				}
			});
		};
		
		$rootScope.open = function(group) {
			$rootScope.group = angular.copy(group);
			
			ngDialog.open({
				template: 'popup.html',
				controller: ['$scope', '$injector', function($scope, $injector) {
					$rootScope.closeThisDialog = function() {
						$scope.closeThisDialog();
					};
				}]
			});
		};
		
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
		
		// Group functions
		$rootScope.userGroup = {
			create: function() {
				$rootScope.error.userGroup = undefined;
				console.log('createGroup');
				$http({
					method: 'POST',
					url: '/ws/sandbox/userGroup/createGroup',
					data: {
						user: $rootScope.user,
						group: $rootScope.userGroup
					}
				}).then(function(response) {
					$rootScope.response  = response;
					$state.go('createGroup.success');
				}).catch(function(error) {
					$rootScope.error.userGroup = 'error: ' + error.data.message;
					console.error('Error', error);
				});
			}
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
