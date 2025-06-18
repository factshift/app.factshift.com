const appVersion = 'v0.0.1';
const cacheName  = `serviceworker@${appVersion}`;

const staticAssets = [
  './',
];

// Cache all JS and CSS files from the current version
async function cacheAssets() {
  const assetsToCache = staticAssets;

  // Fetch all JS and CSS files in the document
  const links = Array.from(document.querySelectorAll('link[rel="stylesheet"], script[src]'))
      .map(el => el.href || el.src);

  // Add JS and CSS files to the static assets to be cached
  assetsToCache.push(...links);

  const cache = await caches.open(cacheName);
  await cache.addAll(assetsToCache);
}

self.addEventListener('install', async event => {
  event.waitUntil(cacheAssets());
});

self.addEventListener('fetch', event => {
  const req = event.request;
  const url = new URL(req.url);

  if (url.origin === location.origin) {
    event.respondWith(cacheFirst(req));
  } else {
    event.respondWith(networkFirst(req));
  }
});

async function cacheFirst(req) {
  const cacheResponse = await caches.match(req);
  return cacheResponse || fetch(req);
}

async function networkFirst(req) {
  const cache = await caches.open('dynamic-cache');
  try {
    const res = await fetch(req);
    cache.put(req, res.clone());
    return res;
  } catch (error) {
    return await cache.match(req);
  }
}
