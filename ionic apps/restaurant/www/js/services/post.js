angular.module('roots.services')

.factory('Post', function($http, $filter) {

	var post_type = 'post';
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
		get: function(page, posts_per_page) {
			return $http.jsonp(api+'get_posts/?page='+page+'&post_type=' + post_type +'&posts_per_page='+ posts_per_page +'&callback=JSON_CALLBACK');
		},
		getFromCategory: function(catID, page, posts_per_page){
			return $http.jsonp(api+'get_posts/?cat='+catID+'&page='+page+'&post_type=' + post_type +'&posts_per_page='+ posts_per_page +'&callback=JSON_CALLBACK');
		}
	};

});