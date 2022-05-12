angular.module('roots.controllers')

.controller('MapCtrl', function($scope, $timeout, $rootScope, $sce, $localstorage, $compile, NgMap) {

	NgMap.getMap().then(function(map) {
		$scope.map = map;
	});

	$scope.marker = {
		title: 'title',
		content: 'content'
	};

	$scope.markers = [
		{
			'id': 'marker-1',
			'title' : 'Location #1',
			'content' : 'First Location, lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras a viverra magna',
			'location'  : [40.7112, -74.213]
		}, 
		{
			'id': 'marker-2',
			'title' : 'Location #2',
			'content' : 'Second Location, lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras a viverra magna',
			'location'  : [40.7243, -74.2014]
		}, 
		{
			'id': 'marker-3',
			'title' : 'Location #3',
			'content' : 'Third Location, lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras a viverra magna',
			'location'  : [40.7312, -74.1923]
		}
	];

	$scope.showMarker = function(event, marker){
		$scope.marker = marker;
		$scope.map.showInfoWindow('marker-info', marker.id);
	};


});
