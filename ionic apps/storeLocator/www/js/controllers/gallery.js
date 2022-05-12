angular.module('roots.controllers')

.controller('GalleryCtrl', function($scope, $timeout, $rootScope, $sce, $localstorage, $ionicSlideBoxDelegate, $ionicModal, Gallery) {

	$scope.gallery_id = 1970;
	$scope.isFetching = true;
  	$scope.images = [];
  	$scope.localStoragePrefix = 'gallery_'; 
  	$scope.grid = 3;
  	$scope.useLocalStorage = true; // set to false if you don't want local storage

  	$scope.loadPhotos = function(){
  		if($scope.useLocalStorage === true && $localstorage.getObject( $scope.localStoragePrefix + 'items' ) !== null ){
			$scope.images = $localstorage.getObject( $scope.localStoragePrefix + 'items' );
			Gallery.all($scope.images);
			$scope.isFetching = false;
		} else {
			$scope.getPhotos();
		}
  	};

  	$scope.getPhotos = function(){

  		Gallery.getById($scope.gallery_id).success(function(response){

			$scope.images = response.photos;
			Gallery.all($scope.images);

			$scope.isFetching = false;
			
			if($scope.useLocalStorage === true){
				$localstorage.setObject($scope.localStoragePrefix + 'items', $scope.images);
			}

			if($scope.shouldRefresh===true){
				$scope.$broadcast('scroll.refreshComplete');
				$scope.shouldRefresh = false;
			}

		});

  	};

  	$scope.doRefresh = function(){
		$localstorage.remove($scope.localStoragePrefix + 'items');
		$scope.images = [];
		$scope.shouldRefresh = true;
		$scope.loadPhotos();		
	};

	// let's start
	$scope.loadPhotos();
  
	$ionicModal.fromTemplateUrl('templates/gallery-modal.html', {
		scope: $scope,
		animation: 'slide-in-up'
	}).then(function(modal) {
		$scope.modal = modal;
	});

    $scope.closeModal = function() {
		$scope.modal.hide();
    };

    // Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function() {
		$scope.modal.remove();
    });
  
  	$scope.goToSlide = function(row, index) {
  		var imageIndex = (row * $scope.grid) + (index);
  		console.log(imageIndex);
		$scope.modal.show();
		$timeout(function() {
			$ionicSlideBoxDelegate.slide(imageIndex);
		}, 100);
    };

});
