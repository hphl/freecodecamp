$( document ).ready(function() {
  var streamersList = ["ESL_SC2", "OgamingSC2", "freecodecamp"];
  checkTwitch(streamersList);
  getLiveChannels(streamersList);
  $('.status').click(function(){
    if(!$(this).hasClass('active')){
      $('.status.active').removeClass('active');
      $(this).addClass('active');
      var status = $(this).attr("status");
      if(status === "all"){
        $(".online").removeClass("hidden");
        $(".offline").removeClass("hidden");
      }else if(status === "online"){
        $(".online").removeClass("hidden");
        $(".offline").addClass("hidden");
      }else{
        $(".offline").removeClass("hidden");
        $(".online").addClass("hidden");
      }
    }

  });
});
function getLiveChannels(streamersList){
  $.when(
    getData('https://wind-bow.glitch.me/twitch-api/streams/featured', "limit=5")
  ).done(function(livechannels){
    var channel;
    for (var i = 0; i < 5; i++) {
      channel = livechannels.featured[i];
      if(streamersList.indexOf(channel.stream.channel.display_name) === -1)
        showResults(channel.stream.channel);
    }
    /*livechannels.featured.forEach(function(channel){
      if(streamersList.indexOf(channel.stream.channel.display_name) === -1){
        showResults(channel.stream.channel);
      }
    });*/
  });
}
function checkTwitch(channelsList){

  var channelContent,
      channelGame;
  channelsList.forEach(function(channelName){
    $.when(
      getData('https://wind-bow.glitch.me/twitch-api/streams/' + channelName),
      getData('https://wind-bow.glitch.me/twitch-api/channels/' + channelName)
    ).done(function( liveChannel, channelData ) {
      if(!channelData.hasOwnProperty('error')){
        if(liveChannel.stream === null){
          channelData.status = "Currently offline.";
          channelData.game = "Offline";
        }
        showResults(channelData);
      }
    });
  });
}

function showResults(channelData) {
  //console.log(channelData);
  var content = truncateContent(channelData.status);
  title = channelData.display_name;
  url = channelData.url;
  logo = channelData.logo;
  game = channelData.game;
  //document.getElementById("twitch-box").insertAdjacentHTML('beforeend', createResultBox(title, content, url, logo,game));
  var twitchBox = document.getElementById("twitch-box");
  if(game === "Offline")
    twitchBox.appendChild(createResultBox(title, content, url, logo,game));
  else
  {
    twitchBox.insertBefore(createResultBox(title, content, url, logo,game),twitchBox.firstElementChild.nextElementSibling);
  }
}
function getData(pURL, parameters = ""){
  return Promise.resolve($.ajax({
    url: pURL,
    dataType: 'json',
    data: parameters,
    error: function(xhr, textStatus, errorThrown) {
      console.log(textStatus, errorThrown);
    },
    success: function(data, textStatus, request) {
      //callback(data);
    }
  }));
}
function createResultBox(title, content, url, logo, game){
  var newDiv = document.createElement('div');
  newDiv.innerHTML =  '<div class="row ' + (game === 'Offline' ? 'offline' : 'online') + '">' +
                        '<div class="col-xs-2 logo">'+
                          '<a href="' + url + '">'+
                            '<img class="img img-responsive" src="' + logo + '">'+
                          '</a>'+
                        '</div>'+
                        '<div class="col-xs-10 channelContent">' +
                          '<div class="row">' +
                            '<div class="col-sm-4">'+
                              '<a href="' + url + '" target="_blank">'+
                                '<h4>' + title + '</h4>'+
                              '</a>'+
                            '</div>' +
                            '<div class="col-sm-8">' +
                              '<p class="truncate-txt">'+
                                '<span class="bold-txt">' + game + ':</span> '+ content +
                              '</p>'+
                            '</div>'+
                          '</div>' +
                        '</div>' +
                      '</div>';
  return newDiv.firstChild;
}
function truncateContent(content){
  if(content.length > 60)
    return  content.substring(0, 56) + "...";
  return content;
}
