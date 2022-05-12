angular.module('roots.controllers')

.controller('MenuCtrl', function($scope, $ionicModal, $timeout, $rootScope, User) {

	$scope.isLogged = false;

	if(User.isLoggedIn()){
		$scope.isLogged = true;
	}

	$scope.logout = function() {
		User.logout();
	};

});
