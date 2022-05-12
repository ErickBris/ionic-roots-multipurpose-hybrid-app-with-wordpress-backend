angular.module('roots.controllers')

.controller('CategoriesCtrl', function($scope, $ionicModal, $timeout, $sce, $localstorage, Category) {

	$scope.categories = [];
	$scope.isFetching = true;	
	$scope.shouldRefresh = false;

	$scope.localStoragePrefix = 'category_index_'; 
	$scope.useLocalStorage = true; // set to false if you don't want local storage

	$scope.loadMore = function(refresh) {
		
		if($scope.useLocalStorage === true && $localstorage.getObject( $scope.localStoragePrefix + 'items' ) !== null ){

			$scope.categories = $localstorage.getObject( $scope.localStoragePrefix + 'items' );
			Category.all($scope.categories);
			$scope.isFetching = false;

		} else {

			$scope.getCategories();

		}
			
	};

	$scope.getCategories = function(){
		Category.get('full').success(function(response){

			$scope.categories = response.categories;
			Category.all($scope.categories);

			$scope.isFetching = false;
			$scope.$broadcast('scroll.infiniteScrollComplete');
			
			if($scope.useLocalStorage === true){
				$localstorage.setObject($scope.localStoragePrefix + 'items', $scope.categories);
			}

			if($scope.shouldRefresh===true){
				$scope.$broadcast('scroll.refreshComplete');
				$scope.shouldRefresh = false;
			}

		});
	};

	$scope.doRefresh = function(){
		$localstorage.remove($scope.localStoragePrefix + 'items');
		$scope.categories = [];
		$scope.shouldRefresh = true;
		$scope.loadMore();		
	};

	// let's start
	$scope.loadMore();

});
