$( document ).ready(function() {
  var window_height = $( window ).outerHeight();
  $(".grl-section").css("height", window_height);
  $(document).scroll(function () {
    var $nav = $(".navbar-fixed-top");
    $nav.toggleClass('scrolled', $(this).scrollTop() > $nav.height());
  });
});
