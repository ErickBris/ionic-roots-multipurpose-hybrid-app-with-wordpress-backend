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
		getBySlug: function(slug){
			var catSlug = slug;
			var selected_category = $filter('filter')(items, function (d) {return d.slug === catSlug;});
			return selected_category[0];
		},
		get: function(image_size, taxonomy, orderby) {

			var setOrderby = 'name';
			if(orderby !== undefined){
				setOrderby = orderby;
			}

			if (taxonomy !== undefined){
				return $http.jsonp(api+'roots/get_categories/?image_size='+image_size+'&taxonomy='+taxonomy+'&orderby='+setOrderby+'&callback=JSON_CALLBACK');
			}
			return $http.jsonp(api+'roots/get_categories/?image_size='+image_size+'&orderby='+setOrderby+'&callback=JSON_CALLBACK');
		}
	};

});