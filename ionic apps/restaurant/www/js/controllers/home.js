angular.module('roots.controllers')

.controller('HomeCtrl', function($scope, $timeout, $rootScope, $sce, $localstorage, $ionicPopup, Post, Bookmark) {

	$scope.posts = [];
	$scope.isFetching = true;	
	$scope.shouldRefresh = false;

	$scope.settings = {
		current_page: 1,
		total_items: 1,
		total_pages: 0
	};

	$scope.items_per_page = 3;
	$scope.localStoragePrefix = 'home_'; 
	$scope.useLocalStorage = true; // set to false if you don't want local storage

	$scope.loadMore = function(refresh) {

		if($scope.useLocalStorage === true && $localstorage.getObject( $scope.localStoragePrefix + 'settings' ) !== null ){

			$scope.posts = $localstorage.getObject( $scope.localStoragePrefix + 'items' );
			Post.all($scope.posts);
			$scope.settings = $localstorage.getObject( $scope.localStoragePrefix + 'settings' );
			$scope.isFetching = false;

			if($scope.settings.current_page < $scope.settings.total_pages){
				$scope.getPosts();
			}
		} else {
			$scope.getPosts();
		}
			
	};

	$scope.getPosts = function(){
		Post.get($scope.settings.current_page, $scope.items_per_page).success(function(response){

			$scope.posts = $scope.posts.concat(response.posts);
			Post.all($scope.posts);

			$scope.settings.total_items = response.count_total;	
			$scope.settings.total_pages = response.pages;	
			$scope.settings.current_page++;

			$scope.isFetching = false;
			$scope.$broadcast('scroll.infiniteScrollComplete');
			
			if($scope.useLocalStorage === true){
				$localstorage.setObject($scope.localStoragePrefix + 'items', $scope.posts);
				$localstorage.setObject($scope.localStoragePrefix + 'settings', $scope.settings);
			}

			if($scope.shouldRefresh===true){
				$scope.$broadcast('scroll.refreshComplete');
				$scope.shouldRefresh = false;
			}

		});
	};

	$scope.canBeLoaded = function(){
		if($scope.settings.current_page < $scope.settings.total_pages){
			return true;
		} else {
			return false;
		}
	};

	$scope.doRefresh = function(){
		$localstorage.remove($scope.localStoragePrefix + 'items');
		$localstorage.remove($scope.localStoragePrefix + 'settings');
		$scope.posts = [];
		$scope.settings = {
			current_page: 1,
			total_items: 1,
			total_pages: 0
		};
		$scope.shouldRefresh = true;
		$scope.loadMore();		
	};

	// let's start
	$scope.loadMore();

	$scope.bookmarkThis = function(item){

		Bookmark.save(item);

		var alertPopup = $ionicPopup.alert({
			title: 'Saved!',
			template: 'You can reading it later.'
		});


	};

});
