(function() {
	'use strict';
	
	var salt = 'Vive la révolution!!!';
	
	var hashPassword = function(user) {
		return new Hashes.SHA1().hex(user.email + user.password + salt);
	};
	
	var doLoginChallenge = function(hash, token) {
		return new Hashes.SHA1().hex(hash + token);
	};
	
	var encodeQueryData = function(obj) {
		var ret = [];
		for (var d in obj) {
			ret.push(encodeURIComponent(d) + "=" + encodeURIComponent(obj[d]));
		}
		return ret.join("&");
	}
	
	var app = angular.module('ry.user', ['ui.router']);
	
	app.config(['$stateProvider', function($stateProvider) {

		$stateProvider.state('signup', {
			url: '/signup',
			templateUrl: 'template/user/signup.html',
			controller: 'SignupCtrl'
		}).state('signup.form', {
			url: '/',
			templateUrl: 'template/user/signup.form.html'
		}).state('signup.success', {
			url: '/',
			templateUrl: 'template/user/signup.success.html'
		}).state('signin', {
			url: '/signin',
			templateUrl: 'template/user/signin.html',
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
		$rootScope.group = {};
		$rootScope.isLogged = false;
		
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
		
		var signinQs = {successUrl: '/sandbox/group/', failureUrl: '/sandbox/group/'};
		
		$rootScope.signin = {
		
			googleApi: function() {
				console.log('connect google');
				$http({
					method: 'GET',
					url: '/ws/sandbox/user/googleApi/signin/',
					params: signinQs
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
				$window.open('/ws/sandbox/user/google/signin?' + encodeQueryData(signinQs), '_self');
			},
			
			facebook: function() {
				console.log('passport facebook');
				$window.open('/ws/sandbox/user/facebook/signin?' + encodeQueryData(signinQs), '_self');
			},
			
			linkedin: function() {
				console.log('passport linkedin');
				$window.open('/ws/sandbox/user/linkedin/signin?' + encodeQueryData(signinQs), '_self');
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
	
	// Controller
	app.controller('SigninCtrl', ['$injector', function($injector) {
		console.log('SigninCtrl');
		var $http = $injector.get('$http');
		var $rootScope = $injector.get('$rootScope');
		
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
	
})();
