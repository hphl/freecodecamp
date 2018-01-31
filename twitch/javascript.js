$( document ).ready(function() {
  $.getJSON('https://wind-bow.glitch.me/twitch-api/streams/freecodecamp?callback=?', function(data) {
    console.log(data);
  });
  $.getJSON('https://wind-bow.glitch.me/twitch-api/channels/freecodecamp?callback=?', function(data) {
    console.log(data);
  });
  //checkTwitch();
});
function checkTwitch(){
  $.ajax({
     url: 'https://wind-bow.gomix.me/twitch-ap/streams/freecodecamp',
     dataType: 'jsonp',
     jsonpCallback: "showResults",
     error: function(xhr, textStatus, errorThrown) {
        console.log(textStatus, errorThrown);
     },
     success: function(data, textStatus, request) {
        //console.log(data);
        showResults(data);
     }
  });
}

function showResults(data) {
  console.log(data);
}
function createResultBox(title, content, url){
  return  '<div class="media">'+
            '<div class="media-body">'+
              '<a href="' + url + '" target="_blank">'+
                '<h4 class="media-heading">' + title + '</h4>'+
              '</a>'+
              '<cite>' + url + '</cite>'+
              '<span>' + content + '</span>'+
            '</div>'+
          '</div>';
}
