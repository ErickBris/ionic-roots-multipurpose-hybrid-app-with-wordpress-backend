angular.module('roots.controllers')

.controller('BookmarkCtrl', function($scope, $timeout, $rootScope, $sce, $localstorage, $ionicScrollDelegate, Bookmark, Post) {

	$scope.posts = Bookmark.all();

	$scope.deleteBookmark = function(id){
		Bookmark.deleteById(id);	
		$scope.posts = Bookmark.all();	
		$ionicScrollDelegate.resize();
	};

});
