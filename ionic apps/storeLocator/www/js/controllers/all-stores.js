angular.module('roots.controllers')

.controller('AllStoresCtrl', function($scope, $timeout, $rootScope, $sce, $localstorage, $ionicPopup, $ionicActionSheet, Store, mapView, NgMap) {

	if(mapView){
		NgMap.getMap().then(function(map) {
			$scope.map = map;
			console.log('map loaded');
			$scope.getUserGeolocation();
		});
	}
	
	$scope.showNear = false;

	$scope.posts = [];
	$scope.stores = [];
	$scope.isFetching = true;	
	$scope.shouldRefresh = false;

	// Geo variables
	$scope.userLocation = {
		lat: 14.677252,
		lng: -90.55
	};

    $scope.minDistance = 2000; // Km

	$scope.settings = {
		current_page: 1,
		total_items: 1,
		total_pages: 0
	};

	$scope.items_per_page = -1;
	$scope.localStoragePrefix = 'stores_'; 
	$scope.useLocalStorage = true; // set to false if you don't want local storage

	$scope.getUserGeolocation = function(){           

		navigator.geolocation.getCurrentPosition(function(position){

			$scope.userLocation = {
				lat: position.coords.latitude,
				lng: position.coords.longitude
			};

			// let's start
			$scope.loadAll();			

		}, function(error){

			var alertPopup = $ionicPopup.alert({
				title: 'Error',
				template: "We couldn't get your location to check for the locations, please enable the permissions and try again."
			});

			console.log(error);

		}, {

			maximumAge:60000,
			timeout:10000,
			enableHighAccuracy: true

		});

  	};


	$scope.loadAll = function(refresh) {

		if($scope.useLocalStorage === true && $localstorage.getObject( $scope.localStoragePrefix + 'settings' ) !== null ){

			$scope.posts = $localstorage.getObject( $scope.localStoragePrefix + 'items' );
			Store.all($scope.posts);
			$scope.settings = $localstorage.getObject( $scope.localStoragePrefix + 'settings' );
			$scope.isFetching = false;

			if($scope.settings.current_page < $scope.settings.total_pages){
				$scope.getStores();
			} else {
				$scope.processLocations($scope.posts);
			}

		} else {
			$scope.getStores();
		}
			
	};

	$scope.processLocations = function(locations){

		$scope.isFetching = true;
		$scope.stores = [];

		for (index = 0; index < locations.length; index++){

			var latitude = locations[ index ].custom_fields.location[0].lat;
        	var longitude = locations[ index ].custom_fields.location[0].lng;

			var distance = $scope.Haversine( locations[ index ].custom_fields.location[0].lat, locations[ index ].custom_fields.location[0].lng, $scope.userLocation.lat, $scope.userLocation.lng );

			if ($scope.showNear){

				if ( distance < $scope.minDistance ){
                	
                	$scope.stores.push({
			          'id'    : 'location_'+index,
			          'original_id' : locations[index].id,
			          'title'   : locations[ index ].title,
			          'content'   : locations[ index ].content,
			          'description'   : locations[ index ].custom_fields.description[0],
			          'address' : locations[ index ].custom_fields.address[0],
			          'hours'   : locations[ index ].custom_fields.open_hours[0],
			          'phone'   : locations[ index ].custom_fields.phone[0],
			          'distance'  : (Math.round(distance * 100) / 100),
			          'location'  : [locations[ index ].custom_fields.location[0].lat, locations[ index ].custom_fields.location[0].lng]
			        });

              	}

			} else {

				$scope.stores.push({
		          'id'    : 'location_'+index,
		          'original_id' : locations[index].id,
		          'title'   : locations[ index ].title,
		          'content'   : locations[ index ].content,
		          'description'   : locations[ index ].custom_fields.description[0],
		          'address' : locations[ index ].custom_fields.address[0],
		          'hours'   : locations[ index ].custom_fields.open_hours[0],
		          'phone'   : locations[ index ].custom_fields.phone[0],
		          'distance'  : (Math.round(distance * 100) / 100),
		          'location'  : [locations[ index ].custom_fields.location[0].lat, locations[ index ].custom_fields.location[0].lng]
		        });
			}
		
		}

		$scope.isFetching = false;
		
	};

	$scope.getStores = function(){
		Store.get($scope.settings.current_page, $scope.items_per_page).success(function(response){

			$scope.posts = $scope.posts.concat(response.posts);
			Store.all($scope.posts);

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

			$scope.processLocations($scope.posts);

		});
	};


	$scope.doRefresh = function(){
		$localstorage.remove($scope.localStoragePrefix + 'items');
		$localstorage.remove($scope.localStoragePrefix + 'settings');
		
		$scope.stores = [];
		$scope.posts = [];
		$scope.settings = {
			current_page: 1,
			total_items: 1,
			total_pages: 0
		};
		$scope.shouldRefresh = true;

		$scope.loadAll();
	};

	$scope.showMarker = function(event, marker){
		$scope.marker = marker;
		console.log(marker);
		$scope.map.showInfoWindow('marker-info', marker.id);
	};

	$scope.showSettings = function() {

		var buttonsSettings = [
	       { text: 'Show Near' },
	       { text: 'Refresh' }
	    ];

		if($scope.showNear){
			buttonsSettings = [
		       { text: 'Show All' },
		       { text: 'Refresh' }
		    ];
		} 
		 
	   // Show the action sheet
	   var hideSheet = $ionicActionSheet.show({
	     buttons: buttonsSettings,
	     titleText: 'Location Settings',
	     cancelText: 'Cancel',	     
	     buttonClicked: function(index) {

	     	switch(index) {
			    case 0: // facebook

			    	if($scope.showNear){
			    		console.log('show all');
			    		$scope.showNear = false;
			    		$scope.processLocations($scope.posts);
			    	} else { 
			    		console.log('show near');
			    		$scope.showNear = true;
			    		$scope.processLocations($scope.posts);
			    	}

			        break;
		        case 1: // email
		        	console.log('refresh');
		        	$scope.isFetching = true;
		        	$scope.doRefresh();
			        break;
			}

			return true;
	     }
	   });

	 };

	// Math Functions
	$scope.Deg2Rad = function(deg) {
		return deg * Math.PI / 180;
	};

	// Get Distance between two lat/lng points using the Haversine function
	// First published by Roger Sinnott in Sky & Telescope magazine in 1984 ("Virtues of the Haversine")
	$scope.Haversine = function( lat1, lon1, lat2, lon2 ){
		var R = 6372.8; // Earth Radius in Kilometers

		var dLat = $scope.Deg2Rad(lat2-lat1);  
		var dLon = $scope.Deg2Rad(lon2-lon1);  

		var a = Math.sin(dLat/2) * Math.sin(dLat/2) + 
		              Math.cos($scope.Deg2Rad(lat1)) * Math.cos($scope.Deg2Rad(lat2)) * 
		              Math.sin(dLon/2) * Math.sin(dLon/2);  
		var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
		var d = R * c; 

		// Return Distance in Kilometers
		return d;
	};
	
	// Load the stores

	$scope.loadAll();
	

});
