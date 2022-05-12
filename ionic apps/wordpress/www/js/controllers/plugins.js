angular.module('roots.controllers')

.controller('PluginsCtrl', function($scope, $timeout, $rootScope, $sce, $localstorage, $ionicPlatform, $filter, $ionicActionSheet,
	$cordovaEmailComposer, // Email Composer plugin
	$cordovaDatePicker, // Date Picker Plugin
	$cordovaInAppBrowser, // InAppBrowser Plugin
	$cordovaSocialSharing, // Social Share Plugin
	$cordovaCamera, // Camera Plugin
	$cordovaBarcodeScanner // Barcode Plugin
	) {


	// Email Composer plugin
	var emailOptions = {
		to: 'tim@apple.com',
		cc: 'bill@microsoft.com',
		bcc: ['john@doe.com', 'jane@doe.com'],
		/*
		attachments: [
		  'file://img/logo.png',
		  'res://icon.png',
		  'base64:icon.png//iVBORw0KGgoAAAANSUhEUg...',
		  'file://README.pdf'
		],
		*/
		subject: 'Ionic Roots',
		body: 'How are you? Nice greetings from Roots',
		isHtml: true
	};

	$scope.emailComposer = function(){
		console.log('email composer plugin');
		ionic.Platform.ready(function() {
			console.log('email composer plugin getting ready...');
	        $cordovaEmailComposer.open(emailOptions).then(null, function () {
				// user cancelled email
			});
		});
	};
	

	// Date Picker
	var datePickerOptions = {
		date: new Date(),
		mode: 'date', // or 'time'
		minDate: new Date() - 10000,
		allowOldDates: true,
		allowFutureDates: true,
		doneButtonLabel: 'DONE',
		doneButtonColor: '#F2F3F4',
		cancelButtonLabel: 'CANCEL',
		cancelButtonColor: '#000000'
	};

	$scope.pickedDate = 'Pick a date';

	$scope.datePicker = function(){
		console.log('date picker plugin');
		$ionicPlatform.ready(function() {
			console.log('date picker plugin getting ready...');
			$cordovaDatePicker.show(datePickerOptions).then(function(date){

				console.log(date);

				var day   = date.getDate();
				var month   = date.getMonth() + 1;
				var year  = date.getFullYear();

				$scope.pickedDate = $filter('date')(date, 'MMMM d, yyyy');		
			});

		});
	};

	// InAppBrowser Plugin

	var inAppBrowserOptions = {
      location: 'yes',
      clearcache: 'yes',
      toolbar: 'yes'
    };

	$scope.openSite = function(){
		console.log('InAppBrowser plugin');
		$ionicPlatform.ready(function() {

			$cordovaInAppBrowser.open('http://google.com', '_blank', inAppBrowserOptions)
			.then(function(event) {
			// success
			})
			.catch(function(event) {
			// error
			});

		});
	};

	// Camera and Social Share Plugins

	$scope.placeholderImage = 'img/placeholder.jpg';

	$scope.openCamera = function(){

		$ionicPlatform.ready(function() {

			var cameraOptions = {
				quality: 50,
				destinationType: Camera.DestinationType.FILE_URI,
				sourceType: Camera.PictureSourceType.CAMERA,
				allowEdit: false,
				encodingType: Camera.EncodingType.JPEG,
				targetWidth: 800,
				targetHeight: 800,
				popoverOptions: CameraPopoverOptions,
				saveToPhotoAlbum: true,
				correctOrientation:true
			};

			$cordovaCamera.getPicture(cameraOptions).then(function(imageURI) {
				$scope.placeholderImage = imageURI;
				}, function(err) {
					// error
			});

			$cordovaCamera.cleanup().then(function(){}); // only for FILE_URI

		});
	};

	$scope.sharePhoto = function(post){

		$ionicActionSheet.show({
			buttons: [
				{ text: 'Share on Facebook' },
				{ text: 'Share on Twitter' }
			],
			titleText: 'Share this Article',
			cancelText: 'Cancel',
			cancel: function() {
				// add cancel code..
			},
			buttonClicked: function(index) {
				
				var message = 'Check this picture!';

				switch(index) {
				    case 0: // facebook
				    	$ionicPlatform.ready(function() {
					        $cordovaSocialSharing.shareViaFacebook(message, $scope.placeholderImage)
							.then(function(result) { }, function(err) { });
						});
				        break;
				    case 1: // twitter
				    	$ionicPlatform.ready(function() {
					        $cordovaSocialSharing.shareViaTwitter(message, $scope.placeholderImage)
							.then(function(result) { }, function(err) { });
						});
				        break;
				}

				return true;
			}
		});

	};

	// Barcode Plugin

	$scope.scanBarcode = function(){
		$ionicPlatform.ready(function() {
			$cordovaBarcodeScanner
			.scan()
			.then(function(barcodeData) {
				alert('The result was print in the console');
				console.log(barcodeData);
			}, function(error) {
				alert('There was an error, please try again.');
				// An error occurred
			});
		});
	};

	// Admob Plugin

	var ad_units = {
		ios : {
			banner: 'ca-app-pub-xxxxxxx/xxxxxxx', // or DFP format "/6253334/dfp_example_ad"
			interstitial: 'ca-app-pub-xxxxxxx/xxxxxxx'
		},
		android : {
			banner: 'ca-app-pub-xxxxxxx/xxxxxxx', // or DFP format "/6253334/dfp_example_ad"
			interstitial: 'ca-app-pub-xxxxxxx/xxxxxxx'
		}
	};

	// select the right Ad Id according to platform
	var admobid = ( /(android)/i.test(navigator.userAgent) ) ? ad_units.android : ad_units.ios;

	// Let's create the ads but don't show them. 
	$ionicPlatform.ready(function() {

		if (! AdMob ) { console.log( 'admob plugin not ready' ); return; }

	  	if ( AdMob ){
	  		
		  	var admobDefaultOptions = {
		        adSize: 'SMART_BANNER',
		        // width: integer, // valid when set adSize 'CUSTOM'
		        // height: integer, // valid when set adSize 'CUSTOM'
		        position: AdMob.AD_POSITION.BOTTOM_CENTER,
		        // offsetTopBar: false, // avoid overlapped by status bar, for iOS7+
		        bgColor: 'black', // color name, or '#RRGGBB'
		        isTesting: true, // set to true, to receiving test ad for testing purpose
		        autoShow: false // auto show interstitial ad when loaded, set to false if prepare/show
		    };

		    AdMob.setOptions( admobDefaultOptions );		    

			// Let's create a Banner and Interstitial ads
			if(AdMob){
				AdMob.createBanner({ adId:admobid.banner, autoShow: false });

				AdMob.prepareInterstitial({
				    adId: admobid.interstitial,
				    autoShow: false
				});
			}

			// More Examples

			/*
			// It will create a smart banner in bottom center using the default options
			if(AdMob) AdMob.createBanner( admobid.banner );

			// it will display smart banner at top center
			if(AdMob) AdMob.createBanner( {
			    adId:admobid.banner, 
			    position:AdMob.AD_POSITION.TOP_CENTER, 
			    autoShow:true} );

			// or, show a rect ad at bottom in overlap mode
			if(AdMob) AdMob.createBanner( {
			    adId:admobid.banner, 
			    adSize:'MEDIUM_RECTANGLE', 
			    overlap:true, 
			    position:AdMob.AD_POSITION.BOTTOM_CENTER, 
			    autoShow:true} );

			// or, show any size at any position
			if(AdMob) AdMob.createBanner( {
			    adId:admobid.banner, 
			    adSize:'CUSTOM',  width:200, height:200, 
			    overlap:true, 
			    position:AdMob.AD_POSITION.POS_XY, x:100, y:200, 
			    autoShow:true} );
			*/
		}
	});

	$scope.showBanner = function(){
		$ionicPlatform.ready(function() {
			if(AdMob) AdMob.showBanner();
		});
	};

	$scope.hideBanner = function(){
		// If you want to remove it use AdMob.removeBanner();
		$ionicPlatform.ready(function() {
			if(AdMob) AdMob.hideBanner();
		});
	};

	$scope.showInterstitial = function(){
		$ionicPlatform.ready(function() {
			if(AdMob) AdMob.showInterstitial();
		});
	};

});
