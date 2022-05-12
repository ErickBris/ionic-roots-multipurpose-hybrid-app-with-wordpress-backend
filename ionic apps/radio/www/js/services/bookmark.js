angular.module('roots.services')

.factory('Bookmark', function($http, $filter, $localstorage) {

	var items = [];

	if($localstorage.getObject( 'bookmark_items' )!==null){
		items = $localstorage.getObject( 'bookmark_items' );
	}

	return {
		all: function(data){
			return items;
		},
		save: function(item){
			items.push(item);
			$localstorage.setObject('bookmark_items', items);
		},
		getById: function(id){
			var postID = parseInt(id);
			var selected_post = $filter('filter')(items, function (d) {return d.id === postID;});
			return selected_post[0];
		},
		deleteById: function(id) {
			var postID = parseInt(id);
			items = $filter('filter')(items, function(value, index) {
				return value.id !== postID;
			});
			$localstorage.setObject('bookmark_items', items);
		}
	};

});