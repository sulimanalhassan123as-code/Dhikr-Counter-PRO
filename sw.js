const CACHE="dhikr-pro-cache"
545
const urls=[
"/",
"/index.html",
"/style.css",
"/script.js"
]

self.addEventListener("install",e=>{
e.waitUntil(
caches.open(CACHE).then(cache=>{
return cache.addAll(urls)
})
)
})

self.addEventListener("fetch",e=>{
e.respondWith(
caches.match(e.request).then(res=>{
return res||fetch(e.request)
})
)
})
