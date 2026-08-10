const CACHE_NAME = 'jb1-v1';

const ASSETS = [
  '/',
  '/index.html',
  '/slopkit/poops.html',
  '/slopkit/cat.jpg',
  '/slopkit/mmhmm-cats-ps5.gif',
  '/slopkit/core.js',
  '/slopkit/int64.js',
  '/slopkit/main.js',
  '/slopkit/mem.js',
  '/slopkit/rop.js',
  '/slopkit/rop_slave.js',
  '/slopkit/syscalls.js',
  '/offsets/9.00.js',
  '/offsets/9.20.js',
  '/offsets/9.40.js',
  '/offsets/9.60.js',
  '/offsets/10.00.js',
  '/offsets/10.01.js',
  '/offsets/10.20.js',
  '/offsets/10.40.js',
  '/offsets/10.60.js',
  '/offsets/11.00.js',
  '/offsets/11.20.js',
  '/offsets/11.40.js',
  '/offsets/11.60.js',
  '/offsets/12.00.js',
  '/payloads/Payload_Manager_v0.5.1.elf',
  '/payloads/elfldr-ps5-1360.elf',
  '/payloads/ftpsrv-ps5.elf',
  '/payloads/gdbsrv-ps5.elf',
  '/payloads/kexp_2026_05_25.bin',
  '/payloads/klogsrv-ps5.elf',
  '/payloads/kstuff.elf',
  '/payloads/shsrv-ps5.elf',
  '/payloads/websrv-ps5.elf',
  '/ui/payload-ftp-default.png',
  '/ui/payload-ftp-failed.png',
  '/ui/payload-ftp-sending.png',
  '/ui/payload-ftp-sent.png',
  '/ui/payload-gdb-default.png',
  '/ui/payload-gdb-failed.png',
  '/ui/payload-gdb-sending.png',
  '/ui/payload-gdb-sent.png',
  '/ui/payload-klog-default.png',
  '/ui/payload-klog-failed.png',
  '/ui/payload-klog-sending.png',
  '/ui/payload-klog-sent.png',
  '/ui/payload-kstuff-default.png',
  '/ui/payload-kstuff-failed.png',
  '/ui/payload-kstuff-sending.png',
  '/ui/payload-kstuff-sent.png',
  '/ui/payload-menu-title.png',
  '/ui/payload-pm-default.png',
  '/ui/payload-pm-failed.png',
  '/ui/payload-pm-sending.png',
  '/ui/payload-pm-sent.png',
  '/ui/payload-shell-default.png',
  '/ui/payload-shell-failed.png',
  '/ui/payload-shell-sending.png',
  '/ui/payload-shell-sent.png',
  '/ui/payload-web-default.png',
  '/ui/payload-web-failed.png',
  '/ui/payload-web-sending.png',
  '/ui/payload-web-sent.png',
  '/document/en/ps5/index.html',
];

// Install: cache everything
self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(ASSETS);
    }).then(function () {
      return self.skipWaiting();
    })
  );
});

// Activate: delete old caches
self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys.filter(function (k) { return k !== CACHE_NAME; })
            .map(function (k) { return caches.delete(k); })
      );
    }).then(function () {
      return self.clients.claim();
    })
  );
});

// Fetch: cache-first, fall back to network
self.addEventListener('fetch', function (e) {
  e.respondWith(
    caches.match(e.request).then(function (cached) {
      if (cached) return cached;
      return fetch(e.request).then(function (response) {
        // Cache any new successful GET responses dynamically
        if (e.request.method === 'GET' && response && response.status === 200) {
          var clone = response.clone();
          caches.open(CACHE_NAME).then(function (cache) {
            cache.put(e.request, clone);
          });
        }
        return response;
      });
    }).catch(function () {
      // If both cache and network fail, return a minimal offline message
      return new Response('Offline - resource not cached yet.', {
        status: 503,
        headers: { 'Content-Type': 'text/plain' }
      });
    })
  );
});
