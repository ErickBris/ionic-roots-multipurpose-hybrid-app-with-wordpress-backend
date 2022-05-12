angular.module('roots.controllers')

.controller('ProgrammingCtrl', function($scope, $timeout, $rootScope, $sce, $localstorage, $ionicPopup, PostTax) {

	$scope.posts = [];
	$scope.items = [];
	$scope.custom_fields = [];
	$scope.isFetching = true;	
	$scope.shouldRefresh = false;

	$scope.settings = {
		current_page: 1,
		total_items: 1,
		total_pages: 0
	};

	$scope.items_per_page = 1;
	$scope.localStoragePrefix = 'programming_'; 
	$scope.useLocalStorage = false; // set to false if you don't want local storage

	var weekdays = [
		'sunday',
		'monday',
		'tuesday',
		'wednesday',
		'thursday',
		'friday',
		'saturday'
	];

	var d = new Date();
	$scope.currentDay = weekdays[d.getDay()];
	$scope.repeater_custom_field = 'programming';

	$scope.loadMore = function(refresh) {

		if($scope.useLocalStorage === true && $localstorage.getObject( $scope.localStoragePrefix + 'settings' ) !== null ){

			$scope.posts = $localstorage.getObject( $scope.localStoragePrefix + 'items' );
			$scope.custom_fields = $scope.posts[0].custom_fields;
			PostTax.all($scope.posts);

			$scope.processRepeater($scope.custom_fields);
			
			$scope.settings = $localstorage.getObject( $scope.localStoragePrefix + 'settings' );
			$scope.isFetching = false;

		} else {
			$scope.getPosts();
		}
		

	};

	$scope.getPosts = function(){

		PostTax.get($scope.settings.current_page, 'programming', 'day', $scope.currentDay, $scope.items_per_page).success(function(response){

			$scope.posts = $scope.posts.concat(response.posts);
			PostTax.all($scope.posts);
			$scope.custom_fields = $scope.posts[0].custom_fields;

			$scope.processRepeater($scope.custom_fields);

			$scope.settings.total_items = response.count_total;	
			$scope.settings.total_pages = response.pages;	
			$scope.settings.current_page++;

			$scope.isFetching = false;
			
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

	$scope.processRepeater = function(custom_fields){

		var total_items = custom_fields[$scope.repeater_custom_field][0];

		for(i = 0; i < total_items; i++){
			var search_string = $scope.repeater_custom_field + '_' + i + '_';

			var z = Object.keys(custom_fields).filter(function(k) {
			    return k.indexOf(search_string) === 0;
			}).reduce(function(newData, k) {
				var new_key_name = k.replace(search_string,'');
			    newData[new_key_name] = custom_fields[k];
			    return newData;
			}, {});		

			$scope.items.push(z);
		}
		
	};


	$scope.doRefresh = function(){
		$localstorage.remove($scope.localStoragePrefix + 'items');
		$localstorage.remove($scope.localStoragePrefix + 'settings');
		$scope.posts = [];
		$scope.items = [];
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

});
