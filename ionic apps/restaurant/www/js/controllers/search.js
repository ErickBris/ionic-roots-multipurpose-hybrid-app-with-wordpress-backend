angular.module('roots.controllers')

.controller('SearchCtrl', function($scope, $timeout, $rootScope, $sce, $localstorage, $ionicPopup, Search, Bookmark) {

	$scope.posts = [];
	$scope.isFetching = false;	
	$scope.noResults = false;

	$scope.settings = {
		current_page: 1,
		total_items: 1,
		total_pages: 0
	};

	$scope.items_per_page = 10;

	$scope.search = function(query){

		$scope.posts = [];
		$scope.noResults = false;
		$scope.settings = {
			current_page: 1,
			total_items: 1,
			total_pages: 0
		};
		$scope.isFetching = true;
		$scope.keyword = query;
		$scope.getPosts(query);

	};

	$scope.getPosts = function(){

		Search.query($scope.keyword, $scope.settings.current_page, $scope.items_per_page).success(function(response){

			$scope.posts = $scope.posts.concat(response.posts);
			Search.all($scope.posts);

			$scope.settings.total_items = response.count_total;	
			$scope.settings.total_pages = response.pages;	
			$scope.settings.current_page++;

			if($scope.posts.length > 0){
				$scope.noResults = false;
			} else {
				$scope.noResults = true;
			}

			$scope.isFetching = false;
			$scope.$broadcast('scroll.infiniteScrollComplete');			

		});

	};

	$scope.canBeLoaded = function(){
		if($scope.settings.current_page < $scope.settings.total_pages){
			return true;
		} else {
			return false;
		}
	};

	$scope.bookmarkThis = function(item){

		Bookmark.save(item);

		var alertPopup = $ionicPopup.alert({
			title: 'Saved!',
			template: 'You can reading it later.'
		});

	};

});
