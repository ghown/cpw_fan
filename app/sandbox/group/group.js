(function() {
	'use strict';
	
	var app = angular.module('ry.group', ['ui.router', 'ngDialog', 'ry.user']);
	
	app.config(['$stateProvider', function($stateProvider) {

		$stateProvider.state('createGroup', {
			url: '/createGroup',
			templateUrl: 'template/group/create.html'
		}).state('createGroup.form', {
			url: '/',
			templateUrl: 'template/group/create.form.html'
		}).state('createGroup.success', {
			url: '/',
			templateUrl: 'template/group/create.success.html'
		});
	}]);
	
	app.run(['$injector', function($injector) {
		var $http = $injector.get('$http');
		var $rootScope = $injector.get('$rootScope');
		var $window = $injector.get('$window');
		var $state = $injector.get('$state');
		var $stateParams = $injector.get('$stateParams');
		var ngDialog = $injector.get('ngDialog');
		
		$rootScope.open = function(group) {
			$rootScope.group = angular.copy(group);
			
			ngDialog.open({
				template: 'tempplate/group/update.html',
				controller: ['$scope', '$injector', function($scope, $injector) {
					$rootScope.closeThisDialog = function() {
						$scope.closeThisDialog();
					};
				}]
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
})();
