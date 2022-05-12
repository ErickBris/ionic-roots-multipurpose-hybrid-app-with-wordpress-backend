angular.module('roots.services')

.factory('Stream', function($http) {

	var lastFMKey = 'ab68e9a71c1bb15efaa9c706b646dee4';
	var lastFM = 'http://ws.audioscrobbler.com/2.0/?method=track.search&format=json&limit=1&api_key='+ lastFMKey +'&track=';

	function parseStreamResponse(response){		
		var regex = response.data.match(/<body[^>]*>((.|[\n\r])*)<\/body>/im)[1];
		var parts = regex.split(',');
		if(parts.length == 7){
			return parts[6];
		}
		return null;
	}

	function getAlbumArt(songTitle){
		return $http.get(lastFM + encodeURIComponent(songTitle)).then(function(response){
			if(response.error){
				return 'img/cover.png';
			} else {
				if( response.data.results!== undefined ){
	            	if(response.data.results.trackmatches !="\n" ){
	                	if(response.data.results.trackmatches.track[0].image !== undefined){
	                		return response.data.results.trackmatches.track[0].image[3]['#text'];
	                	} else {
	                		return 'img/cover.png';
	                	}                  
	                } else {
	                	return 'img/cover.png'; 
	                }
	            }
			}
		});
	}

	return {
		getInfo: function(url){
			var streamingUrl = url;
			var streamingDataUrl = streamingUrl + '7.html';
			
			return $http.get(streamingDataUrl).then(function(data){

				var song = parseStreamResponse(data);

				if(song===''){
					return '';
				}
				return getAlbumArt(song).then(function(albumArt){					
					var streamData = {
						song: song,
						albumArt: albumArt
					};
					return streamData;
				});
			});
		}
	};

});