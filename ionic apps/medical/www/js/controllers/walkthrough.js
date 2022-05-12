angular.module('roots.controllers')

.controller('WalkthroughCtrl', function($scope, $rootScope, $timeout, $state, Walkthrough) {

	$scope.goHome = function(){
		console.log('go home');
		Walkthrough.markAsShown();
		$state.go("app.home");	
	};

});
