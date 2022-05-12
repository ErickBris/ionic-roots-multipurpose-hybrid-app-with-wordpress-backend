angular.module('roots.controllers')

.controller('LocationCtrl', function($scope, $ionicModal, $timeout, $sce, $ionicPlatform, $ionicPopup, $ionicScrollDelegate, $ionicActionSheet, item, NgMap) {

	$scope.item = item;
	$scope.itemContent = $sce.trustAsHtml(item.content);
	$scope.isFetching = false;

	var alertPopup;

	$scope.marker = {
      'title'   : $scope.item.title,
      'content'   : $scope.item.content,
      'description'   : $scope.item.custom_fields.description[0],
      'address' : $scope.item.custom_fields.address[0],
      'hours'   : $scope.item.custom_fields.open_hours[0],
      'phone'   : $scope.item.custom_fields.phone[0].replace(/[^0-9]/g, ''),
      'location'  : [$scope.item.custom_fields.location[0].lat, $scope.item.custom_fields.location[0].lng]
    };
	

	$scope.getDirections = function(marker){
		window.open('http://maps.google.com/maps?q='+marker.location, '_system', 'location=yes');
	};

	$scope.openDialer = function(marker){
		window.open('tel:'+marker.phone, '_system', 'location=yes');
	};

});
