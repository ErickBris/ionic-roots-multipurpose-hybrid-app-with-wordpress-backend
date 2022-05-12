angular.module('roots.services')

.factory('Walkthrough', function($filter, $localstorage) {

	var wasShown = false;

	if(typeof $localstorage.get("walkthrough") !== 'undefined' && $localstorage.get("walkthrough")!==null){
		wasShown = true;
	}

	return {
		hasBeenShown: function(){
			return wasShown;
		},
		markAsShown: function(){
			wasShown = true;
			$localstorage.set('walkthrough', 'seen');
		}
	};

});