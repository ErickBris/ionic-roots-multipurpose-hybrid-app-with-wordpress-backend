angular.module('roots.services')

.factory('Category', function($http, $filter) {

	var items = [];

	return {
		all: function(data){
			items = data;
		},
		getById: function(id){
			var catID = parseInt(id);
			var selected_category = $filter('filter')(items, function (d) {return d.id === catID;});
			return selected_category[0];
		},
		get: function(image_size) {
			return $http.jsonp(api+'roots/get_categories/?image_size='+image_size+'&callback=JSON_CALLBACK');
		}
	};

});