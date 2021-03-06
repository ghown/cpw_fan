(function() {
	'use strict';
	
	var salt = 'Vive la révolution!!!';
	
	var hashPassword = function(user) {
		return new Hashes.SHA1().hex(user.email + user.password + salt);
	};
	
	var doLoginChallenge = function(hash, token) {
		return new Hashes.SHA1().hex(hash + token);
	};

	var app = angular.module('myApp', ['ui.router']);
	
	app.config(['$locationProvider', '$stateProvider', '$urlRouterProvider', function($locationProvider, $stateProvider, $urlRouterProvider) {
	
		$locationProvider
			.html5Mode(true)
			.hashPrefix('!');

		$urlRouterProvider.otherwise('/');

		$stateProvider.state('home', {
			url: '/',
			templateUrl: 'home.html'
		}).state('signup', {
			url: '/signup',
			templateUrl: 'signup.html',
			controller: 'SignupCtrl'
		}).state('signup.form', {
			url: '/',
			templateUrl: 'signup.form.html'
		}).state('signup.success', {
			url: '/',
			templateUrl: 'signup.success.html'
		}).state('signin', {
			url: '/signin',
			templateUrl: 'signin.html',
			controller: 'SigninCtrl'
		});
	}]);
	
	app.run(['$injector', function($injector) {
		var $http = $injector.get('$http');
		var $rootScope = $injector.get('$rootScope');
		var $window = $injector.get('$window');
		var $state = $injector.get('$state');
		var $stateParams = $injector.get('$stateParams');
		
		$rootScope.user = {};
		$rootScope.$state = $state;
		$rootScope.$stateParams = $stateParams; 
		$rootScope.isLogged = false;
		$rootScope.error = {};
		
		$rootScope.$on('$stateChangeStart', function() {
			$rootScope.error = {};
		});
		
		$rootScope.getUser = function() {
			console.log('getUser');
			$http({
				method: 'GET',
				url: '/ws/sandbox/user/getUser'
			}).then(function(response) {
				console.log('getUser ok');
				$rootScope.user = response.data;
				$rootScope.isLogged = true;
			}).catch(function(error) {
				if (error.status != 401) {
					console.error('Error', error);
				}
			});
		};
		
		$rootScope.getUser();
		
		$rootScope.resetDB = function() {
			$rootScope.error.resetDB = undefined;
			console.log('resetDB');
			$http({
				method: 'GET',
				url: '/ws/admin/resetDB'
			}).then(function(response) {
				console.log('resetDB ok');
			}).catch(function(error) {
				console.error('Error', error);
				$rootScope.error.resetDB = 'error: ' + error.data.message;
			});
		};
		
		$rootScope.signup = function() {
			$rootScope.error.signup = undefined;
			console.log('signup');
			var user = angular.copy($rootScope.user);
			user.password = hashPassword(user);
			$http({
				method: 'POST',
				url: '/ws/sandbox/user/signup',
				data: user
			}).then(function(response) {
				$rootScope.response = response;
				$rootScope.isLogged = true;
				$state.go('signup.success');
			}).catch(function(error) {
				$rootScope.error.signup = 'error: ' + error.data.message;
				console.error('Error', error);
			});
		};
		
		$rootScope.signin = {
		
			googleApi: function() {
				console.log('connect google');
				$http({
					method: 'GET',
					url: '/ws/sandbox/user/googleApi/signin/'
				}).then(function(response) {
					$rootScope.response = response;
					$window.open(response.data.url, '_self');
				}).catch(function(error) {
					$rootScope.error.connect = 'error: ' + error.data.message;
					console.error('Error', error);
				});
			},
		
			google: function() {
				console.log('passport google');
				$window.open('/ws/sandbox/user/google/signin', '_self');
			},
			
			facebook: function() {
				console.log('passport facebook');
				$window.open('/ws/sandbox/user/facebook/signin', '_self');
			},
			
			linkedin: function() {
				console.log('passport linkedin');
				$window.open('/ws/sandbox/user/linkedin/signin', '_self');
			},
			
			local: function() {
				$rootScope.error.signin = undefined;
				console.log('signin');
				var user = angular.copy($rootScope.user);
				user.password = doLoginChallenge(hashPassword(user), $rootScope.token);
				$http({
					method: 'POST',
					url: '/ws/sandbox/user/local/signin',
					data: user
				}).then(function(response) {
					$rootScope.response  = response;
					$rootScope.user  = response.data;
					$rootScope.isLogged = true;
					$state.go('home');
				}).catch(function(error) {
					$rootScope.error.signin = 'error: ' + error.data.message;
					console.error('Error', error);
				});
			}
		};
		
		$rootScope.logout = function() {
			$rootScope.error.logout = undefined;
			console.log('logout');
			$http({
				method: 'GET',
				url: '/ws/sandbox/user/logout'
			}).then(function(response) {
				$rootScope.response  = response;
				$rootScope.user = {};
				$rootScope.isLogged = false;
				$state.go('home');
			}).catch(function(error) {
				$rootScope.error.logout = 'error: ' + error.data.message;
				console.error('Error', error);
			});
		};
		

	}]);
	
	app.controller('SigninCtrl', ['$injector', function($injector) {
		console.log('SignupCtrl');
		var $http = $injector.get('$http');
		var $rootScope = $injector.get('$rootScope');
		var $window = $injector.get('$window');
		var $state = $injector.get('$state');
		var $stateParams = $injector.get('$stateParams');
		
		$rootScope.getLoginToken = function() {
			console.log('getLoginToken');
			$http({
				method: 'GET',
				url: '/ws/sandbox/user/getLoginToken'
			}).then(function(response) {
				$rootScope.response  = response;
				$rootScope.token = response.data.token;
			}).catch(function(error) {
				$rootScope.token = '';
				console.error('Error', error);
			});
		};
		
		$rootScope.getLoginToken();
		$rootScope.user.keepLogged = true;
		
	}]);
	
	app.controller('SignupCtrl', ['$injector', function($injector) {
		console.log('SignupCtrl');
		var $rootScope = $injector.get('$rootScope');
		
		$rootScope.user = {};
		
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
