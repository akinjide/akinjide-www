importScripts('static/javascript/lib/sw-toolbox/sw-toolbox.js')
importScripts('static/javascript/lib/sw-offline-google-analytics.js')

goog.offlineGoogleAnalytics.initialize()

const preCacheFiles = [
  'https://fonts.googleapis.com/css?family=Raleway:400,700',
  'https://fonts.googleapis.com/css?family=Sanchez',

  'static/images/akinjide-404.png',
  'static/images/akinjide-avatar.png',
  'static/images/akinjide-avatar-white.png'
]

toolbox.precache(preCacheFiles)

self.addEventListener('install', event => event.waitUntil(self.skipWaiting()))
self.addEventListener('activate', event => event.waitUntil(self.clients.claim()))
self.addEventListener('fetch', event => {
  event.respondWith(
    caches
      .match(event.request)
      .then(response => response ? response : fetch(event.request))
  )
})