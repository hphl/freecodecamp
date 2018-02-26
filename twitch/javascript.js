$( document ).ready(function() {
  var streamersList = ["ESL_SC2", "OgamingSC2", "cretetion", "freecodecamp", "storbeck", "habathcx", "RobotCaleb", "noobs2ninjas"];
  checkTwitch(streamersList);
  $('.status').click(function(){
    if(!$(this).hasClass('active')){
      $('.status.active').removeClass('active');
      $(this).addClass('active');
    }

  });
});
function checkTwitch(channelsList){
  var channelContent,
      channelGame;
  channelsList.forEach(function(channelName){
    $.when(
      getData('https://wind-bow.glitch.me/twitch-api/streams/' + channelName),
      getData('https://wind-bow.glitch.me/twitch-api/channels/' + channelName)
    ).done(function( liveChannel, channelData ) {
      if(liveChannel.stream === null){
        channelContent = "Offline";
        channelGame = "Offline";
      } else if (liveChannel.stream === undefined) {
        channelContent = "Offline";
        channelGame = "Account Closed";
      }
      else{
        channelContent = liveChannel.stream.channel.status;
        channelGame = liveChannel.stream.game;
      }
      channelData.content = channelContent;
      channelData.game = channelGame;
      showResults(channelData);
    });
  });
  /*channelsList.forEach(function(item){
  getData('https://wind-bow.glitch.me/twitch-api/users/' + item, showResults);
});*/
/*channelsList.forEach(function(item){
getData('https://wind-bow.glitch.me/twitch-api/channels/' + item, showResults);
});*/
}

function showResults(channelData) {
  //console.log(channelData);
  var content = channelData.content;
  title = channelData.display_name;
  url = channelData.url;
  logo = channelData.logo;
  game = channelData.game;
  document.getElementById("channels").insertAdjacentHTML('beforeend', createResultBox(title, content, url, logo,game));
}
function getData(pURL){
  return Promise.resolve($.ajax({
    url: pURL,
    dataType: 'jsonp',
    error: function(xhr, textStatus, errorThrown) {
      console.log(textStatus, errorThrown);
    },
    success: function(data, textStatus, request) {
      //callback(data);
    }
  }));
}
function createResultBox(title, content, url, logo,game){
  return  '<li class="list-group-item">' +
            '<div class="media">'+
              '<div class="media-left">'+
                '<a href="' + url + '">'+
                  '<img class="media-object" src="' + logo + '">'+
                '</a>'+
              '</div>'+
              '<div class="media-body">'+
                '<a href="' + url + '" target="_blank">'+
                  '<h4 class="media-heading">' + title + '</h4>'+
                '</a>'+
                '<p>' + game + '</p>'+
                '<p>' + content + '</p>'+
              '</div>'+
            '</div>' +
          '</li>';
}
