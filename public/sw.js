const version = new URL(location).searchParams.get("version") || "dev";
const CACHE_NAME = `chime-cache-${version}`;

// Install event
self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache =>
            cache.addAll([
                "/",

                "/css/main.css",
                "/css/main.css.map",

                "/lib/favicon/gray.png",
                "/lib/favicon/green.png",
                "/lib/favicon/orange.png",
                "/lib/favicon/red.png",
                "/lib/favicon/yellow.png",

                // "/lib/fonts/inter-v19-latin-700.woff2",
                // "/lib/fonts/inter-v19-latin-regular.woff2",
                // "/lib/fonts/noto-sans-runic-v17-latin-regular.woff2",
                // "/lib/fonts/roboto-v48-latin-700.woff2",
                // "/lib/fonts/roboto-v48-latin-regular.woff2",
                // "/lib/fonts/wingding.woff",

                "/lib/icon/quick-link/classroom.png",
                "/lib/icon/quick-link/powerschool.png",

                "/lib/icon/152.png",
                "/lib/icon/192.png",
                "/lib/icon/512.png",

                "/lib/img/close.png",
                "/lib/img/feedback.png",
                "/lib/img/schedule.png",
                "/lib/img/settings.png",
                "/lib/img/trash.png",

                "/lib/js/idb-helper.js",
                "/lib/js/idb.js",
                "/lib/js/jquery-3.7.1.slim.js",

                "/schools/egan.json",

                "/index.html",
                "/manifest.json",
                "/scripts.js",
            ])
        ).catch(err => {
            console.error("Service worker install failed:", err);
        })
    );
    self.skipWaiting();
});

// Activate event
self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys
                .filter(key => key !== CACHE_NAME)
                .map(key => caches.delete(key))
            )
        ).then(() => self.clients.claim())
    );
});

// Fetch event with network-first approach
self.addEventListener("fetch", event => {
    if (event.request.url === "https://chimewebsite.netlify.app/manifest.json") {
        return; // let the browser handle it normally
    }

    event.respondWith(
        fetch(event.request).then(response => {
            // Clone response and update cache
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then(cache => {
                cache.put(event.request, responseClone);
            });
            return response;
        }).catch(() => {
            // If network fails, try cache
            return caches.match(event.request).then(resp => {
                if (resp) return resp;
                // Optional fallback: return cached index.html
                return caches.match("/index.html");
            });
        })
    );
});