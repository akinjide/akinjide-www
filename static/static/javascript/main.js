$(function() {
  var terminate

  /** Article Time. */
  $("main article header h1").on({
    mouseenter: function() {
      return clearTimeout(terminate), $(".read-time").addClass("active")
    },
    mouseleave: function() {
      return terminate = setTimeout(function() {
        return $(".read-time").removeClass("active")
      }, 200)
    }
  })
})