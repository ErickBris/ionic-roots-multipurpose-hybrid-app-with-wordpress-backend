angular.module('roots.controllers')

.controller('AuthCtrl', function($scope, $timeout, $rootScope, $sce, $localstorage, $ionicModal, $ionicPopup, $ionicLoading, $location, User) {

	$scope.modalTitle = 'Login';
	$scope.forgotMode = false;

	$scope.loginData = {};
	$scope.signupData = {};

	$ionicModal.fromTemplateUrl('templates/auth.login.html', {
		scope: $scope
	}).then(function(modal) {
		$scope.loginModal = modal;
	});

	$ionicModal.fromTemplateUrl('templates/auth.signup.html', {
		scope: $scope
	}).then(function(modal) {
		$scope.signupModal = modal;
	});

	$scope.changeToForgot = function(){
		$scope.modalTitle = 'Forgot Password';
		$scope.forgotMode = true;
	};

	$scope.changeToLogin = function(){
		$scope.modalTitle = 'Login';
		$scope.forgotMode = false;
	};

	$scope.closeLogin = function() {
		$scope.loginModal.hide();
		$scope.changeToLogin();
	};

	$scope.openLogin = function() {
		$scope.loginModal.show();
	};

	$scope.doLogin = function() {

		var nonce;

		if($scope.loginData.username!=='' && $scope.loginData.password!==''){

			$ionicLoading.show({
				template: 'Loading...'
			});

			User.getAuthNonce().success(function(response){

				if(response.status==='ok'){
          			nonce = response.nonce;          

          			User.login(nonce, $scope.loginData.username, $scope.loginData.password).success(function(response){
						
						if(response.status==='ok'){
							$ionicLoading.hide();
							$scope.loginModal.hide();
							$localstorage.set("token", response.cookie);
							User.set(response.user);
							$rootScope.$broadcast('user.login');
							$location.path('/app/home');
						} else {
							$ionicLoading.hide();
							$ionicPopup.alert({
								title: 'Error',
								template: "Your username/password was incorrect, please try again."
							});
						}

					}).error(function(response){
						$ionicLoading.hide();
						$ionicPopup.alert({
							title: 'Error',
							template: "There was an error connecting to the server, please try again later."
						});
					});

          		} else {
          			$ionicLoading.hide();
          			$ionicPopup.alert({
						title: 'Error',
						template: "There was an error connecting to the server, please try again later."
					});
          		}

			}).error(function(){
				$ionicLoading.hide();
				$ionicPopup.alert({
					title: 'Error',
					template: "There was an error connecting to the server, please try again later."
				});
			});
		
		} else {
			$ionicPopup.alert({
				title: 'Error',
				template: "You can't leave any fields empty."
			});
		}		
	};

	$scope.retrievePassword = function(){
		
		if($scope.loginData.username!==''){

			$ionicLoading.show({
				template: 'Loading...'
			});

			User.forgotPassword($scope.loginData.username).success(function(response){
				
				$ionicLoading.hide();
				$ionicPopup.alert({
					title: 'Success!',
					template: "A link for password reset has been emailed to you. Please check your email."
				});

			}).error(function(response){
				$ionicLoading.hide();
				$ionicPopup.alert({
					title: 'Error',
					template: "There was an error connecting to the server, please try again later."
				});
			});
		} else {
			$ionicLoading.hide();
			$ionicPopup.alert({
				title: 'Error',
				template: "Please enter your username"
			});
		}		

	};


	$scope.closeSignup = function() {
		$scope.signupModal.hide();
	};

	$scope.openSignup = function() {
		$scope.signupModal.show();
	};

	$scope.doSignup = function(form){

		if(form.$valid) {			

			$ionicLoading.show({
				template: 'Loading...'
			});

			User.getRegisterNonce().success(function(response){

				if(response.status==='ok'){
          			nonce = response.nonce;          

          			User.register(nonce, $scope.signupData.name, $scope.signupData.username, $scope.signupData.email, $scope.signupData.password ).success(function(response){

          				if(response.status==='ok'){

          					$localstorage.set("token", response.cookie);

          					User.getInfo( response.user_id ).success(function(response){

          						if(response.status==='ok'){

          							$ionicLoading.hide();
									$scope.signupModal.hide();
									response.username = $scope.signupData.username;
									response.email = $scope.signupData.email;		
									User.set(response);
									$rootScope.$broadcast('user.login');
									$location.path('/app/home');

          						} else {
          							$ionicLoading.hide();
									$ionicPopup.alert({
										title: 'Error',
										template: "There was an error connecting to the server, please try again later."
									});
          						}

          					}).error(function(){
          						$ionicLoading.hide();
								$ionicPopup.alert({
									title: 'Error',
									template: "There was an error connecting to the server, please try again later."
								});
          					});
          					

          				} else if (response.status ==='error') {

          					$ionicLoading.hide();
          					$ionicPopup.alert({
								title: 'Error',
								template: response.error
							});

          				}

          			}).error(function(){
          				$ionicLoading.hide();
						$ionicPopup.alert({
							title: 'Error',
							template: "There was an error connecting to the server, please try again later."
						});
          			});

          		}

          	}).error(function(){
          		$ionicLoading.hide();
				$ionicPopup.alert({
					title: 'Error',
					template: "There was an error connecting to the server, please try again later."
				});
  			});

		} else {
			$ionicPopup.alert({
				title: 'Error',
				template: "You can't leave any fields empty."
			});
		}
			
	};

});