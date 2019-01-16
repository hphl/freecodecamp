$( document ).ready(function() {
  $('#results-box').before('<div class="wrapper-total-reults hidden">About <span class="total-results">0</span> results</div>');
  $('#results-box').after('<button class="more-results center-block btn btn-default hidden" data-link="0">Load More Results</button>');
  $('.btn-search').click(function(){
    $('#results-box').removeClass('hidden');
    $('.wrapper-total-reults').removeClass('hidden');
    $('.more-results').removeClass('hidden');
    $('.search-wrapper').removeClass('full-height');
    searchWiki();
  });
  $('.input-search').keypress(function (e) {
      var key = e.which;
      if(key === 13)
      {
        $('.btn-search').click();
        return false;
      }
  });
  $('body').on('click', '.more-results', function(){
    searchWiki($(this).attr('data-link'));
  });
  /*$('.input-search').autocomplete({
    source: function(request, response) {
        $.ajax({
            url: "http://en.wikipedia.org/w/api.php",
            dataType: "jsonp",
            data: {
                'action': "opensearch",
                'format': "json",
                'search': request.term,
                origin: "*"
            },
            success: function(data) {
              console.log(data[1]);
                response(data[1]);
                console.log(response);
            }
        });
    }
  });*/
});
function searchWiki(continue_sroffset){
  if(typeof continue_sroffset === 'undefined'){
    $('#results-box').empty();
    $('.total-results').text(0);
    continue_sroffset = "0";
  }
  $.ajax({
     url: 'https://en.wikipedia.org/w/api.php',
     method: "GET",
     data: {
        format: 'json',
        action: "query",
	      maxlag: "15",
	      origin: "*",
	      list: "search",
        srsearch: $('.input-search').val(),
        srlimit: "15",
        sroffset: continue_sroffset,
        continue: "-||",
     },
     dataType: 'json',
     headers: {
       'Api-User-Agent': 'Example/1.0'
     },
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
  var result_title,
      result_content,
      result_url;
  $('.total-results').text(parseInt($('.total-results').text()) + data.query.search.length);
  data.query.search.forEach(function(item){
      //console.log(item);
      result_title = item.title;
      result_content = item.snippet;
      //result_url = 'https://en.wikipedia.org/?curid=' + item.pageid;
      result_url = 'https://en.wikipedia.org/wiki/' + result_title.replace(' ', '_');
      $('#results-box').append(createResultBox(result_title,result_content,result_url));
  });
  $('.more-results').attr('data-link',data.continue.sroffset);
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
