const version = new URL(location).searchParams.get("version") || "dev";
const CACHE_NAME = `metadata-editor-cache-version`;

self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache =>
            cache.addAll([
                "/",
                "/metadata-editor/index.html",
                "/metadata-editor/styles.css",
                "/metadata-editor/scripts.js",
                "/metadata-editor/manifest.json",
                "/metadata-editor/sw.js",
                "/metadata-editor/lib/mp3tag.min.js",
                "/lib/jquery-3.7.1.slim.js",
            ])
        ).catch(err => {
            console.error("Service worker install failed to cache resources:", err);
        })
    );
});

self.addEventListener("fetch", event => {
    event.respondWith(
        caches.match(event.request).then(resp => resp || fetch(event.request))
    );
});

self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys().then(keys =>
        Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)))
        )
    );
});