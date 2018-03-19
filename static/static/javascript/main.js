$(function() {
  var terminate
  var hour = (new Date()).getHours()
  var origin = window.location.origin
  var $img = $('.index .intro img')
  var $body = $('body')


  /** Page Theme. */
  if ((hour >= 4) && (hour <= 16)) day()
  else night()

  function day() {
    $body.removeClass('dark')
    $img.attr('src', origin + '/static/images/akinjide-avatar.png')
  }

  function night() {
    $body.addClass('dark')
    $img.attr('src', origin + '/static/images/akinjide-avatar-white.png')
  }

  $('#toggle').change(function() {
    if (this.checked) {
      night()
      return
    }

    day()
  })

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