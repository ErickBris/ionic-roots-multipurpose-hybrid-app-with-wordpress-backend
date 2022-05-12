angular.module('roots.controllers')

.controller('PostCtrl', function($scope, $ionicModal, $timeout, $sce, $ionicPlatform, $ionicPopup, $ionicScrollDelegate, $ionicActionSheet, $cordovaSocialSharing, item, Comment, User) {

	$scope.item = item;
	$scope.itemContent = $sce.trustAsHtml(item.content);
	$scope.comments = [];
	$scope.theComment = '';
	$scope.isFetching = false;
	$scope.isLogged = User.isLoggedIn();

	var alertPopup;

	$scope.getComments = function(){
		$scope.isFetching = true;
		Comment.getFromPost($scope.item.id, 'post').success(function(response){
			console.log(response);
			$scope.comments = response.posts[0].comments;
			$ionicScrollDelegate.resize();					
			$scope.isFetching = false;
			$scope.theComment = '';
		});
	};

	$scope.sendComment = function(postID){

		$ionicScrollDelegate.scrollBottom(true);
		$scope.isFetching = true;

		Comment.submit($scope.item.id, $scope.theComment).success(function(response){
			
			if(response.status==='pending' || response.status==='ok'){

				$scope.getComments();
			
			} else {
				alertPopup = $ionicPopup.alert({
					title: 'Error',
					template: 'There was an error trying to submit your comment, please try again later.'
				});
			}

		}).error(function(){
			alertPopup = $ionicPopup.alert({
				title: 'Error',
				template: 'There was an error trying to submit your comment, please try again later.'
			});
		});

	};

	// get the comments
	$scope.getComments();

	$scope.sharePost = function(post){

		$ionicActionSheet.show({
			buttons: [
				{ text: 'Share on Facebook' },
				{ text: 'Share on Twitter' },
				{ text: 'Share on Email' }
			],
			titleText: 'Share this Article',
			cancelText: 'Cancel',
			cancel: function() {
				// add cancel code..
			},
			buttonClicked: function(index) {
				
				var message = 'Check out the article: '+post.title;
				var emailMessage = 'Check out the article: '+post.title+' in this link: '+post.url;

				switch(index) {
				    case 0: // facebook
				    	$ionicPlatform.ready(function() {
					        $cordovaSocialSharing.shareViaFacebook(message, null, post.url)
							.then(function(result) { }, function(err) { });
						});
				        break;
				    case 1: // twitter
				    	$ionicPlatform.ready(function() {
					        $cordovaSocialSharing.shareViaTwitter(message, null, post.url)
							.then(function(result) { }, function(err) { });
						});
				        break;
			        case 2: // email
			        	$ionicPlatform.ready(function() {
					        $cordovaSocialSharing.shareViaEmail(emailMessage)
							.then(function(result) { }, function(err) { });
						});
				        break;
				}

				return true;
			}
		});

	};

});
