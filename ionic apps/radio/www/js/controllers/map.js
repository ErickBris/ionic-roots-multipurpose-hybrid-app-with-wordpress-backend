angular.module('roots.controllers')

.controller('MapCtrl', function($scope, $timeout, $rootScope, $sce, $localstorage, $compile) {

	$scope.infoWindow = {
		title: 'title',
		content: 'content'
	};

	$scope.markers = [
		{
			'id': 1,
			'title' : 'Location #1',
			'content' : 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras a viverra magna',
			'location'  : [40.7112, -74.213]
		}, 
		{
			'id': 2,
			'title' : 'Location #2',
			'content' : 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras a viverra magna',
			'location'  : [40.7243, -74.2014]
		}, 
		{
			'id': 3,
			'title' : 'Location #3',
			'content' : 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras a viverra magna',
			'location'  : [40.7312, -74.1923]
		}
	];

	$scope.showMarker = function(event, id){
		console.log(event);
		console.log(id);
        $scope.marker = $scope.markers[$index];
        console.log($scope.marker);
        $scope.infoWindow = {
        	id: $scope.marker.id,
			title: $scope.marker.title,
			content: $scope.marker.content
        };
        //$scope.$apply();
        $scope.showInfoWindow.apply(this, [event, 'marker-info']);

	};

});
