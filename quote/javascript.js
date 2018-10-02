$( document ).ready(function() {
  getQuote();
  $('#quote-btn').click(function(){
    getQuote();
  });
});

function getQuote(){
  $.ajax({
     url: 'https://andruxnet-random-famous-quotes.p.mashape.com',
     method: "GET",
     headers: {
       'X-Mashape-Key': 'qYBcEJRuZdmshCMKrSkYS0hkCBI4p1ewuqyjsnz9sGqKM64Pmg',
       'Accept': 'application/json',
     },
     data: {
        format: 'json'
     },
     dataType: 'json',
     error: function(xhr, textStatus, errorThrown) {
        console.log(textStatus, errorThrown);
     },
     success: function(data, textStatus, request) {
        //console.log(data);
        SetData(data);
     }
  });
}
function oldgetQuote(){
  var url = 'https://andruxnet-random-famous-quotes.p.mashape.com';
  fetch(url,{
      method: 'GET',
      headers: {
          'Accept': 'application/json',
          'X-Mashape-Key': 'qYBcEJRuZdmshCMKrSkYS0hkCBI4p1ewuqyjsnz9sGqKM64Pmg',
      }
  })
  .then(function(response) {
    //console.log(response);
    return response.json();
  }) // Transform the data into json
  .then(function(data) {
    SetData(data);
  })
  .catch(function(error) {
    // If there is any error you will catch them here
    console.log(error);
  });
}
function changeColor(){
  var colors = ['#16A085','#27AE60','#2C3E50','#F39C12','#E74C3C','#9B59B6','#FB6964','#342224','#472E32','#BDBB99','#77B1A9','#73A857'];
  var new_color = Math.floor(Math.random() * colors.length);
  $('body').animate({
            color: colors[new_color],
            backgroundColor: colors[new_color]
  }, 600);
  $('#quote-box .btn').animate({
            backgroundColor: colors[new_color]
  }, 600);
}
function SetData(data) {
  //console.log(data);
  changeColor();
  // Here you get the data to modify as you please
  var quote = data[0],
      quote_text = quote.quote, //  Create the elements we need
      author = quote.author;
  // var category = quote.category;

      $('#quote-box .quote-text span').text(quote_text);
      $('#quote-box .quote-author').text('- ' + author);
      $('.twitter-share-button').attr("href", 'https://twitter.com/intent/tweet?text="' + quote_text + '" -' +author);
}
