angular.module('roots.services')

.factory('Comment', function($http, $filter, User) {

	return {
		getFromPost: function(id, post_type) {
			return $http.jsonp(api+'get_posts/?post__in[]='+id+'&post_type=' + post_type +'&callback=JSON_CALLBACK');
		},
		submit: function(postID, comment){
			comment = encodeURI(comment);
			var name = encodeURI(User.name());
			var email = encodeURI(User.email());
			console.log(name + ' ' + email);
			return $http.jsonp(api+'respond/submit_comment/?post_id='+postID+'&name='+name+'&email='+email+'&content=' + comment +'&callback=JSON_CALLBACK');
		}
	};

});