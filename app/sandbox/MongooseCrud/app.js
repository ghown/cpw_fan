(function() {
	'use strict';

	var app = angular.module('myApp', ['ngDialog']);

	app.run(['$injector', function($injector) {
		var $http = $injector.get('$http');
		var $rootScope = $injector.get('$rootScope');
		var ngDialog = $injector.get('ngDialog');
		
		$rootScope.checked = {};
		
		$rootScope.hasItemSelected = function() {
			for (var prop in $rootScope.checked) {
				if ($rootScope.checked[prop]) {
					return true;
				}
			}
			return false;
		};
		
		$rootScope.$watch('result', function() {
			$rootScope.checked = {};
		});
		
		$rootScope.open = function(record) {
			$rootScope.obj = angular.copy(record);
			
			ngDialog.open({
				template: 'popup.html',
				controller: ['$scope', '$injector', function($scope, $injector) {
					$rootScope.closeThisDialog = function() {
						$scope.closeThisDialog();
					};
				}]
			});
		};
		
		$rootScope.create = function() {
			$http({
				method: 'POST',
				url: '/ws/sandbox/mongooseCrud/create',
				data: {
					name: $rootScope.obj.name,
					age: Number($rootScope.obj.age)
				}
			}).then(function(response) {
				$rootScope.createMessage = response.data;
			}).then(function() {
				$rootScope.retrieve();
			}).catch(function(error) {
				$rootScope.createMessage = 'error';
				console.log('Error', error);
			});
		};
		
		$rootScope.retrieve = function() {
			$http({
				method: 'GET',
				url: '/ws/sandbox/mongooseCrud/retrieve',
				params: {
					filter: $rootScope.filter
				}
			}).then(function(response) {
				$rootScope.retrieveMessage = response.data.message;
				$rootScope.result = response.data.result;
			}).catch(function(error) {
				$rootScope.retrieveMessage = 'error';
				console.log('Error', error);
			});		
		};
		
		$rootScope.update = function() {
			$rootScope.updateMessage = '';
			$http({
				method: 'POST',
				url: '/ws/sandbox/mongooseCrud/update',
				data: {
					_id: $rootScope.obj._id,
					name: $rootScope.obj.name,
					age: Number($rootScope.obj.age)
				}
			}).then(function(response) {
				$rootScope.updateMessage = response.data.message;
			}).then(function() {
				$rootScope.retrieve();
			}).then(function() {
				$rootScope.closeThisDialog();
			}).catch(function(error) {
				$rootScope.updateMessage = 'error';
				console.log('Error', error);
			});		
		};
		
		$rootScope.delete = function() {
			var list = [];
			for (var prop in $rootScope.checked) {
				if ($rootScope.checked[prop]) {
					list.push(prop);
				}
			}
			$http({
				method: 'POST',
				url: '/ws/sandbox/mongooseCrud/delete',
				data: list
			}).then(function(response) {
				$rootScope.deleteMessage = response.data;
			}).then(function() {
				$rootScope.retrieve();
			}).catch(function(error) {
				$rootScope.deleteMessage = 'error';
				console.log('Error', error);
			});		
		};
		
		$rootScope.drop = function() {
			$http({
				method: 'GET',
				url: '/ws/sandbox/mongooseCrud/drop'				
			}).then(function(response) {
				$rootScope.dropMessage = response.data;
			}).then(function() {
				$rootScope.retrieve();
			}).catch(function(error) {
				$rootScope.dropMessage = 'error';
				console.log('Error', error);
			});		
		};
		
		$rootScope.retrieve();

	}]);
})();
