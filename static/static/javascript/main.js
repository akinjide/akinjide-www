$(function() {
  var terminate
  var hour = (new Date()).getHours()
  var origin = window.location.origin
  var $img = $('.index .intro img')
  var $body = $('body')
  var storage = window.localStorage
  var mode = storage.getItem('mode')
  var MAX_WIDTH_DEVICE = 992;
  var isLessThanDesktop = (window.innerWidth <= MAX_WIDTH_DEVICE);

  /** Page Theme. */
  if (mode) {
    if (mode == 'dark') night()
    if (mode != 'dark') day()
  }

  if (!mode) {
    if ((hour >= 4) && (hour <= 16)) day()
    else night()
  }

  function day() {
    $body.removeClass('dark')
    $img.attr('src', origin + '/static/images/akinjide-avatar.png')
    storage.setItem('mode', 'light')
  }

  function night() {
    $body.addClass('dark')
    $img.attr('src', origin + '/static/images/akinjide-avatar-white.png')
    storage.setItem('mode', 'dark')
  }

  $('#toggle').change(function() {
    if (this.checked && $body.hasClass('dark')) return day()
    if (!this.checked && !$body.hasClass('dark')) return night()
    if (this.checked) return night()

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

  /** Service Worker. */
  if ("serviceWorker" in navigator) {
    var installButton = $('nav ul li.install-button')

    navigator
      .serviceWorker
      .register(origin + '/sw.js')
      .then((reg) => console.log(".:)"))
      .catch((err) => console.log(".:("))

    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault()
      deferredPrompt = e

      $(installButton).css('display', 'inline')
    });

    window.addEventListener('appinstalled', (evt) => {
      $(installButton).hide()
    });

    installButton.click((e) => {
      e.preventDefault()
      deferredPrompt.prompt()
      deferredPrompt
        .userChoice
        .then((choiceResult) => {
          deferredPrompt = null
        })
    })
  }
})
