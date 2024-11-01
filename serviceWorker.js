const cacheName = "mobilnykatolik-assets-v1";
const cacheAssets = [
  "serviceWorker.js",
  "manifest.webmanifest",
  "manifest-dark.webmanifest",
  "/app/index.html",
  "/src/icons/192.png"
]


//Call install event
self.addEventListener("install", (e) => {
  console.log("[Service Worker] Install");
  e.waitUntil(
    (async () => {
      const cache = await caches.open(cacheName);
      console.log("[Service Worker] Caching all: app shell and content");
      await cache.addAll(cacheAssets);
    })()
  );
});

//Call activate event
self.addEventListener("activate", (e) => {
  console.log("[Service Worker] Activate")
  e.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key === cacheName) {
            return;
          }
          return caches.delete(key);
        })
      );
    })
  );
});

//Call fetch event
self.addEventListener('fetch', (event) => {
  // Check if this is a navigation request
  if (event.request.mode === 'navigate') {
    // Open the cache
    event.respondWith(caches.open(cacheName).then((cache) => {
      // Go to the network first
      return fetch(event.request.url).then((fetchedResponse) => {
        cache.put(event.request, fetchedResponse.clone());

        return fetchedResponse;
      }).catch(() => {
        // If the network is unavailable, get
        return cache.match(event.request.url);
      });
    }));
  } else {
    return;
  }
});

/*self.addEventListener("push", event => {
  const title = event.data.text();
  event.waitUntil(
    self.registration.showNotification(title)
  );
})*/

self.addEventListener("push", event => {
  var context = event.data.text();
  context = JSON.parse(context);
   const options = {
      body: context.content,
      timestamp: context.timestamp
    };
   self.registration.showNotification(context.title, options);

   if (context.action != undefined) {
        self.clients.matchAll().then(clients => {
            clients.forEach(client => {
                client.postMessage({action: context.action});
            });
        });
    }
})