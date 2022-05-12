angular.module('roots.services')

.factory('Search', function($http, $filter) {

	// Define the post type that you want to search, if you leave it empty it will search across all the post types
	var post_type = 'post'; 
	var items = [];

	return {
		all: function(data){
			items = data;
		},
		getItemById: function(id){
			var postID = parseInt(id);
			var selected_post = $filter('filter')(items, function (d) {return d.id === postID;});
			return selected_post[0];
		},
		query: function(keyword, page, posts_per_page) {
			return $http.jsonp(api+'get_search_results/?search='+keyword+'&page='+page+'&post_type=' + post_type +'&posts_per_page='+ posts_per_page +'&callback=JSON_CALLBACK');
		}
	};

});
