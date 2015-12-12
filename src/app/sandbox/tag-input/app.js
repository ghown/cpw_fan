(function() {
	'use strict';

	var app = angular.module('myApp', ['ngTagsInput']);
	
	app.config(['tagsInputConfigProvider', function(tagsInputConfigProvider) {
		tagsInputConfigProvider.setDefaults('tagsInput', {
			displayProperty: 'display',
			addOnEnter: false,
			addOnBlur: false,
			minTags: 1
		});
		tagsInputConfigProvider.setDefaults('autoComplete', {
			minLength: 1,
			maxResultsToShow: 3
		});
	}]);

	app.run(['$injector', function($injector) {
		var $rootScope = $injector.get('$rootScope');
		
		$rootScope.cities = [
			{text: 'Paris', display: 'Paris', flag: 'paris.png'},
			{text: 'Torcy', display: 'Torcy'},
			{text: 'Meaux', display: 'Meaux'},
			{text: 'Saint-Sylvain', display: 'Saint-Sylvain'},
			{text: 'Bordeaux', display: 'Bordeaux'},
			{text: 'Lille', display: 'Lille'},
			{text: 'Nantes', display: 'Nantes'},
			{text: 'Rennes', display: 'Rennes'}
		];
		$rootScope.tags = [];
		
		$rootScope.autoComplete = function(query) {
			console.log('autoComplete', query);
			return $rootScope.cities.filter(function(obj) {
				return obj.text.toLowerCase().indexOf(query.toLowerCase()) >= 0;
			});
		};
		
		$rootScope.validate = function() {
			console.log('validate');
		};
		
	}]);
})();
