(function() {
	'use strict';
	
	var app = angular.module('ry.group', ['ui.router', 'ngDialog', 'ry.user']);
	
	app.config(['$stateProvider', function($stateProvider) {

		$stateProvider.state('createGroup', {
			url: '/createGroup',
			templateUrl: 'template/group/create.html',
			controller: 'GroupCtrl'
		}).state('createGroup.form', {
			url: '/',
			templateUrl: 'template/group/create.form.html'
		}).state('createGroup.success', {
			url: '/',
			templateUrl: 'template/group/create.success.html'
		});
	}]);
	
	app.controller('GroupCtrl', ['$injector', '$scope', function($injector, $scope) {
		console.log('GroupCtrl');
		var $http = $injector.get('$http');
		var $state = $injector.get('$state');
		var $stateParams = $injector.get('$stateParams');
		var ngDialog = $injector.get('ngDialog');
		
		$scope.open = function(group) {
			$scope.group = angular.copy(group);
			
			ngDialog.open({
				template: 'template/group/update.html',
				controller: ['$scope', '$injector', function($scope, $injector) {
					$rootScope.closeThisDialog = function() {
						$scope.closeThisDialog();
					};
				}]
			});
		};

		$scope.create = function() {
			console.log('create Group');
			$scope.error.group = undefined;
			
			$http({
				method: 'POST',
				url: '/ws/sandbox/group/create',
				data: {
					user: $scope.user,
					group: $scope.group
				}
			}).then(function(response) {
				$scope.response  = response;
				$state.go('createGroup.success');
			}).catch(function(error) {
				$scope.error.group = 'error: ' + error.data.message;
				console.error('Error', error);
			});
		};
	
		
	}]);
})();
