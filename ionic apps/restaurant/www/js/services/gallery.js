angular.module('roots.services')

.factory('Gallery', function($http, $rootScope, $location, $localstorage) {

  var items = [];
  var post_type = 'gallery';
  var custom_field = 'photos';


  return {
    all: function(data){
      items = data;
    },
    get: function(){
      return items;
    },
    getById: function(gallery_id){
      return $http.jsonp( encodeURI ( api+'roots/get_photos/?gallery_id='+ gallery_id +'&post_type='+ post_type +'&custom_field='+ custom_field +'&callback=JSON_CALLBACK' ) );
    }
  };

});