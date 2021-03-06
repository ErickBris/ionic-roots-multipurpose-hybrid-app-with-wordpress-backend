// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.min.js

var api = 'http://dev.studio31.co/api/';
var useAuth = true;
var showWalkthrough = true;
var showOfflineMessage = true;
var blockIfOffline = true;

angular.module('roots', ['ionic', 'roots.controllers', 'roots.services', 'angularMoment', 'ngMap', 'ngCordova'])

.run(function($ionicPlatform, $rootScope, $state, User, Walkthrough, $cordovaNetwork, $ionicLoading) {

  $ionicPlatform.ready(function() {
    console.log('Im ready');
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

    // Check network status
    var isOnline = $cordovaNetwork.isOnline();
    var isOffline = $cordovaNetwork.isOffline();

    $rootScope.$on('$cordovaNetwork:online', function(event, networkState){
      $ionicLoading.hide();
    });

    $rootScope.$on('$cordovaNetwork:offline', function(event, networkState){      
      if(showOfflineMessage && blockIfOffline){
        $ionicLoading.show({
          template: 'Your device is offline.'
        }); 
      }

      if(showOfflineMessage && !blockIfOffline){
        $ionicLoading.show({
          template: 'Your device is offline.'
        });

        // if you don't want to block the app but just show a message, set here the amount of miliseconds for the message.
        // but if you want to block the app remove the setTimeout.
        setTimeout(function(){
          $ionicLoading.hide();           
        }, 10000);  

      }
    });

    // Code here Push Notifications
    var isAndroid = ( /(android)/i.test(navigator.userAgent) ) ? true : false;

    function initPushwoosh() {

      var pushNotification = window.plugins.pushNotification;
   
      //set push notification callback before we initialize the plugin
      document.addEventListener('push-notification', function(event) {

        if(isAndroid){
          var title = event.notification.title;
          var userData = event.notification.userdata;
          if(typeof(userData) != "undefined") {
              console.warn('user data: ' + JSON.stringify(userData));
          }             
          alert(title);
        } else {
          var notification = event.notification;
          alert(notification.aps.alert);        
          pushNotification.setApplicationIconBadgeNumber(0);
        }

      });

      if(isAndroid){
        pushNotification.onDeviceReady({ projectid: "1015325307791", appid : "46520-1D5DB" }); // Insert your Google Project Number and your PushWoosh App ID
      } else {
        pushNotification.onDeviceReady({pw_appid:"46520-1D5DB"}); // Insert your PushWoosh App ID
      }
       
      //register for pushes
      pushNotification.registerDevice(
        function(status) {
          console.warn('registerDevice: ' + status);
        },
        function(status) {
          console.warn('failed to register : ' + JSON.stringify(status));
          alert(JSON.stringify(['failed to register ', status])); // remove this on production
        }
      );

      if(!isAndroid){
        pushNotification.setApplicationIconBadgeNumber(0);
      }

    }  

    initPushwoosh(); // Hide this line if you don't want push notifications

  });
  
  $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState) {        

    var isGoingToLogin = toState.name === "auth.index";
    var isGoingHome = toState.name === "app.stores";

    if(isGoingToLogin && User.isLoggedIn()){
      event.preventDefault(); 

      if( showWalkthrough && !Walkthrough.hasBeenShown() ){
        console.log('going to walkthrough');
        $state.go("walkthrough");      
      } else {
        console.log('going to home');
        $state.go("app.stores");  
      }

      return;
    }

    if (isGoingToLogin || User.isLoggedIn()){
      return;
    }

    var requireLogin = useAuth && toState.authenticate;
    
    if (requireLogin) {
      event.preventDefault();

      if( showWalkthrough && !Walkthrough.hasBeenShown() ){
        console.log('going to walkthrough');
        $state.go("walkthrough");      
      } else {
        console.log('going to home');
        $state.go("auth.index");  
      }

      return;
    }

    if( !useAuth && showWalkthrough && isGoingHome){

      if(!Walkthrough.hasBeenShown()){
        event.preventDefault();
        $state.go("walkthrough");
      }

      return ;
    }

  });
  
})

.config(function($stateProvider, $urlRouterProvider) {
  
  $stateProvider

  .state('auth', {
    url: '/auth',
    abstract: true,
    templateUrl: 'templates/auth.html',
    controller: 'AuthCtrl',
    authenticate: false
  })

    .state('auth.index', {
      url: '/index',
      views: {
        'authContent': {
          templateUrl: 'templates/auth.index.html',
          controller: 'AuthCtrl'
        }
      },
      authenticate: false
    })

  .state('walkthrough', {
    url: '/walkthrough',
    templateUrl: 'templates/walkthrough.html',
    controller: 'WalkthroughCtrl',
    authenticate: false
  })

  .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'MenuCtrl',
    authenticate: true
  })

    .state('app.home', {
      url: '/home',
      views: {
        'menuContent': {
          templateUrl: 'templates/home.html',
          controller: 'HomeCtrl'
        }
      },
      authenticate: true
    })


    .state('app.stores', {
      url: '/stores',
      views: {
        'menuContent': {
          templateUrl: 'templates/all-store-tabs.html',
          controller: 'TabsStoresCtrl'
        }
      },
      authenticate: true
    })

      .state('app.stores.list', {
        url: '/list',
        views: {
          'tab-store-list': {
            templateUrl: 'templates/stores-list.html',
            controller: 'AllStoresCtrl'
          }
        },
        resolve: {
          mapView: function(){
            return false;
          }
        },
        authenticate: true
      })

        .state('app.stores.list-location', {
          url: '/list-location',
          views: {
            'tab-store-list': {
              templateUrl: 'templates/location.html',
              controller: 'LocationCtrl'
            }
          },
          params: {
            locationId: null
          },
          resolve: {
            item: function($stateParams, Store) {
              return Store.getById($stateParams.locationId);
            }
          },
          authenticate: true
        })

      .state('app.stores.map', {
        url: '/map',
        views: {
          'tab-store-map': {
            templateUrl: 'templates/stores-map.html',
            controller: 'AllStoresCtrl'
          }
        },      
        resolve: {
          mapView: function(){
            return true;
          }
        },
        authenticate: true
      })
      
        .state('app.stores.map-location', {
          url: '/map-location',
          views: {
            'tab-store-map': {
              templateUrl: 'templates/location.html',
              controller: 'LocationCtrl'
            }
          },
          params: {
            locationId: null
          },
          resolve: {
            item: function($stateParams, Store) {
              return Store.getById($stateParams.locationId);
            }
          },
          authenticate: true
        })

    .state('app.categoriesList', {
      url: '/categories/list',
      views: {
        'menuContent': {
          templateUrl: 'templates/categories-list.html',
          controller: 'CategoriesCtrl'
        }
      },
      authenticate: true
    })

    .state('app.categoriesThumb', {
      url: '/categories/thumb',
      views: {
        'menuContent': {
          templateUrl: 'templates/categories-thumb.html',
          controller: 'CategoriesCtrl'
        }
      },
      authenticate: true
    })

    .state('app.categoriesGrid', {
      url: '/categories/grid',
      views: {
        'menuContent': {
          templateUrl: 'templates/categories-grid.html',
          controller: 'CategoriesGridCtrl'
        }
      },
      authenticate: true
    })

    .state('app.categoryArchive', {
      url: '/category/id/:categoryId',
      views: {
        'menuContent': {
          templateUrl: 'templates/category-archive.html',
          controller: 'CategoryArchiveCtrl'
        }
      },
      resolve: {
        category: function($stateParams, Category) {
          return Category.getById($stateParams.categoryId);
        }
      },
      authenticate: true
    })

    .state('app.bookmark', {
      url: '/bookmark',
      views: {
        'menuContent': {
          templateUrl: 'templates/bookmark.html',
          controller: 'BookmarkCtrl'
        }
      },
      authenticate: true
    })

    .state('app.bookmarkPost', {
      url: '/bookmark/post/:postId',
      views: {
        'menuContent': {
          templateUrl: 'templates/post.html',
          controller: 'PostCtrl'
        }
      },
      resolve: {
        item: function($stateParams, Bookmark) {
          return Bookmark.getById($stateParams.postId);
        }
      },
      authenticate: true
    })

    .state('app.search', {
      url: '/search',
      views: {
        'menuContent': {
          templateUrl: 'templates/search.html',
          controller: 'SearchCtrl'
        }
      },
      authenticate: true
    })

    .state('app.searchPost', {
      url: '/search/id/:postId',
      views: {
        'menuContent': {
          templateUrl: 'templates/post.html',
          controller: 'PostCtrl'
        }
      },
      resolve: {
        item: function($stateParams, Search) {
          return Search.getItemById($stateParams.postId);
        }
      },
      authenticate: true
    })

    .state('app.post', {
      url: '/post/:postId',
      views: {
        'menuContent': {
          templateUrl: 'templates/post.html',
          controller: 'PostCtrl'
        }
      },
      resolve: {
        item: function($stateParams, Post) {
          return Post.getById($stateParams.postId);
        }
      },
      authenticate: true
    })

    .state('app.about', {
      url: '/about',
      views: {
        'menuContent': {
          templateUrl: 'templates/about.html',
          controller: 'AboutCtrl'
        }
      },
      authenticate: true
    })

    .state('app.forms', {
      url: '/forms',
      views: {
        'menuContent': {
          templateUrl: 'templates/forms.html',
          controller: 'FormsCtrl'
        }
      },
      authenticate: true
    })

    .state('app.contact', {
      url: '/contact',
      views: {
        'menuContent': {
          templateUrl: 'templates/contact.html',
          controller: 'ContactCtrl'
        }
      },
      authenticate: true
    })

    .state('app.map', {
      url: '/map',
      views: {
        'menuContent': {
          templateUrl: 'templates/map.html',
          controller: 'MapCtrl'
        }
      },
      authenticate: true
    })

    .state('app.gallery', {
      url: '/gallery',
      views: {
        'menuContent': {
          templateUrl: 'templates/gallery.html',
          controller: 'GalleryCtrl'
        }
      },
      authenticate: true
    })

    .state('app.plugins', {
      url: '/plugins',
      views: {
        'menuContent': {
          templateUrl: 'templates/plugins.html',
          controller: 'PluginsCtrl'
        }
      },
      authenticate: true
    });

  $urlRouterProvider.otherwise( function($injector, $location) {
    var $state = $injector.get("$state");
    $state.go("app.stores");
  });
  
})

// filters
.filter('inSlicesOf', function($rootScope) {

    makeSlices = function(items, count) { 
      if (!count)  
        count = 3;
      
      if (!angular.isArray(items) && !angular.isString(items)) return items;
      
      var array = [];
      for (var i = 0; i < items.length; i++) {
        var chunkIndex = parseInt(i / count, 10);
        var isFirst = (i % count === 0);
        if (isFirst)
          array[chunkIndex] = [];
        array[chunkIndex].push(items[i]);
      }

      if (angular.equals($rootScope.arrayinSliceOf, array))
        return $rootScope.arrayinSliceOf;
      else
        $rootScope.arrayinSliceOf = array;
        
      return array;
    };
    
    return makeSlices; 

})

.filter('hrefToJS', function ($sce, $sanitize) {
  return function (text) {
    var regex = /href="([\S]+)"/g;
    var newString = $sanitize(text).replace(regex, "href=\"#\" onClick=\"window.open('$1', '_blank', 'location=yes')\"");
    return $sce.trustAsHtml(newString);
  };
});

// Let's start the module for our controllers
angular.module('roots.controllers',[]);
angular.module('roots.services',[]);


