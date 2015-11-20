(function() {
	'use strict';

	var app = angular.module('myApp', ['ui.router']);

	app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
		$urlRouterProvider.otherwise('/home');

		$stateProvider.state('home', {
			url: '/home',
			templateUrl: 'home.html'
		}).state('home.list', {
			url: "/list",
			templateUrl: "home.list.html",
			controller: ['$scope', function($scope) {
				$scope.items = ["A", "List", "Of", "Items"];
			}]
		}).state('home.list2', {
			url: "/list",
			templateUrl: "home.list2.html",
			controller: ['$scope', function($scope) {
				$scope.items = ["A", "List", "Of"];
			}]
		}).state('home.list2.sublist', {
			url: "/sublist",
			templateUrl: "home.list.html",
			controller: ['$scope', function($scope) {
				$scope.items = ["A", "sublist", "Of"];
			}]
		}).state('state2', {
			url: '/state2',
			templateUrl: 'state2.html'
		});
	}]);
})();
