angular.module('roots.services')

.factory('PostTax', function($http, $filter) {

	var items = [];

	return {
		all: function(data){
			items = data;
		},
		getById: function(id){
			var postID = parseInt(id);
			var selected_post = $filter('filter')(items, function (d) {return d.id === postID;});
			return selected_post[0];
		},
		get: function(page, post_type, taxonomy, slug, posts_per_page) {
			return $http.jsonp(api+'roots/get_posts/?page='+page+'&post_type=' + post_type +'&taxonomy=' + taxonomy +'&slug=' + slug +'&posts_per_page='+ posts_per_page +'&callback=JSON_CALLBACK');
		}
	};

});