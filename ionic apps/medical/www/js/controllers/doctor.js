angular.module('roots.controllers')

.controller('DoctorCtrl', function($scope, $ionicModal, $timeout, $sce, $ionicPlatform, $ionicPopup, $ionicScrollDelegate, $ionicActionSheet, $cordovaSocialSharing, item, User) {

	$scope.item = item;
	$scope.itemContent = $sce.trustAsHtml(item.content);
	$scope.isFetching = false;
	$scope.isLogged = User.isLoggedIn();

});
