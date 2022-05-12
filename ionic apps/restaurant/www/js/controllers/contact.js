angular.module('roots.controllers')

.controller('ContactCtrl', function($scope, $timeout, $rootScope, $sce, $localstorage, $ionicScrollDelegate, $http, $ionicPopup, $ionicLoading) {

	$scope.contact = {};

	$scope.sendEmail = function(form) {

		if(form.$valid) {	

			$ionicLoading.show({
				template: 'Sending...'
			});

			$http({
				method  : 'POST',
				url     : 'http://dev.studio31.co/email/send-email.php',
				data    : {
					name: $scope.contact.name,
					email: $scope.contact.email,
					phone: $scope.contact.phone,
					message: $scope.contact.message
				},  // pass in data as strings
				headers : { 'Content-Type': 'application/x-www-form-urlencoded' }  // set the headers so angular passing info as form data (not request payload)
			}).success(function(data) {

				$scope.contact = {};

				$ionicLoading.hide();

				$ionicPopup.alert({
					title: 'Success',
					template: data
				});

			}).error(function(){

				$ionicLoading.hide();

				$ionicPopup.alert({
					title: 'Error',
					template: "There was an error connecting to the server, please try again."
				});

			});

		} else {
			$ionicLoading.hide();

			$ionicPopup.alert({
				title: 'Error',
				template: "Please fill in all fields."
			});
		}
			
    };

});
