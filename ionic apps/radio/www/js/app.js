// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.min.js

var api = 'http://dev.studio31.co/api/';
var useAuth = true;
var showWalkthrough = false;
var showOfflineMessage = true;
var blockIfOffline = true;

angular.module('roots', ['ionic', 'roots.controllers', 'roots.services', 'angularMoment', 'ngMap', 'ngCordova', 'ngWebAudio'])

.run(function($ionicPlatform, $rootScope, $state, User, Walkthrough, $cordovaNetwork, $ionicLoading) {

  $ionicPlatform.ready(function() {
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

        setTimeout(function(){
          $ionicLoading.hide();           
        }, 10000); // if you don't want to block the app but just show a message, set here the amount of miliseconds for the message. 
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

    //initPushwoosh();

  });
  
  $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState) {        

    var isGoingToLogin = toState.name === "auth.index";
    var isGoingHome = toState.name === "app.radio";

    if(isGoingToLogin && User.isLoggedIn()){
      event.preventDefault(); 

      if( showWalkthrough && !Walkthrough.hasBeenShown() ){
        console.log('going to walkthrough 1');
        $state.go("walkthrough");      
      } else {
        console.log('going to home');
        $state.go("app.radio");  
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
        console.log('going to walkthrough 2');
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
    templateUrl: 'templates/tabs.html',
    authenticate: true
  })

    .state('app.radio', {
      url: '/radio',
      views: {
        'tab-radio': {
          templateUrl: 'templates/radio.html',
          controller: 'RadioCtrl'
        }
      },
      authenticate: true
    })

    .state('app.home', {
      url: '/home',
      views: {
        'tab-home': {
          templateUrl: 'templates/home.html',
          controller: 'HomeCtrl'
        }
      },
      authenticate: true
    })

    .state('app.categoriesList', {
      url: '/categories/list',
      views: {
        'tab-home': {
          templateUrl: 'templates/categories-list.html',
          controller: 'CategoriesCtrl'
        }
      },
      authenticate: true
    })

    .state('app.categoriesThumb', {
      url: '/categories/thumb',
      views: {
        'tab-home': {
          templateUrl: 'templates/categories-thumb.html',
          controller: 'CategoriesCtrl'
        }
      },
      authenticate: true
    })

    .state('app.categoriesGrid', {
      url: '/categories/grid',
      views: {
        'tab-home': {
          templateUrl: 'templates/categories-grid.html',
          controller: 'CategoriesGridCtrl'
        }
      },
      authenticate: true
    })

    .state('app.categoryArchive', {
      url: '/category/id/:categoryId',
      views: {
        'tab-home': {
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
        'tab-home': {
          templateUrl: 'templates/bookmark.html',
          controller: 'BookmarkCtrl'
        }
      },
      authenticate: true
    })

    .state('app.bookmarkPost', {
      url: '/bookmark/post/:postId',
      views: {
        'tab-home': {
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
        'tab-home': {
          templateUrl: 'templates/search.html',
          controller: 'SearchCtrl'
        }
      },
      authenticate: true
    })

    .state('app.searchPost', {
      url: '/search/id/:postId',
      views: {
        'tab-home': {
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
        'tab-home': {
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

    .state('app.programming', {
      url: '/programming',
      views: {
        'tab-programming': {
          templateUrl: 'templates/programming.html',
          controller: 'ProgrammingCtrl'
        }
      },
      authenticate: true
    })

    .state('app.contact', {
      url: '/contact',
      views: {
        'tab-contact': {
          templateUrl: 'templates/contact.html',
          controller: 'ContactCtrl'
        }
      },
      authenticate: true
    })

    .state('app.plugins', {
      url: '/plugins',
      views: {
        'tab-home': {
          templateUrl: 'templates/plugins.html',
          controller: 'PluginsCtrl'
        }
      },
      authenticate: true
    });

  $urlRouterProvider.otherwise( function($injector, $location) {
    var $state = $injector.get("$state");
    $state.go("app.radio");
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


