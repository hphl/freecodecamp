$( document ).ready(function() {
  var window_height;
  var window_width;
  set_width_height();
  $(document).scroll(function () {
    var $nav = $(".navbar-fixed-top");
    $nav.toggleClass('scrolled', $(this).scrollTop() > $nav.height());
  });
  $(window).resize(function(){
    set_width_height();
  });
  var left_carousel_control = false;
  $(".left.carousel-control").click(function(){
    left_carousel_control = true;
  });
  $(".right.carousel-control").click(function(){
    left_carousel_control = false;
  });
  $('#carousel-portfolio').on('slid.bs.carousel', function (evt) {
    //$(this).parent().find('.item').first().insertAfter($(this).parent().find('.item').last());
    $(".item").removeClass("display-inline-block");
    //second_item.addClass("display-inline-block");
    //third_item.addClass("display-inline-block");
    if(window_width > 620 && window_width < 992){
      var second_item = $(".active").next();
      if(second_item.length <= 0 && !left_carousel_control){
        $('.carousel').carousel(0);
      }else if (second_item.length <= 0 && left_carousel_control) {
        left_carousel_control = false;
        var index_item = $(".active", evt.target).index();
        $('.carousel').carousel(index_item - 1);
      }
    }else if(window_width > 992){
      var third_item = $(".active").next().next();
      if(third_item.length <= 0 && !left_carousel_control){
        $('.carousel').carousel(0);
      }else if (third_item.length <= 0 && left_carousel_control) {
        var index_item = $(".active", evt.target).index();
        $('.carousel').carousel(index_item - 2);
      }
    }
  });
  function set_width_height() {
    window_height = $( window ).height();
    window_width = $( "body" ).width();
    $(".grl-section").css("height", window_height);
  }
});
