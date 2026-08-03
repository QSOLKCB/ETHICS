"use strict";

const CACHE_PREFIX = "qsol-ethics-sbaitso-";
const CACHE_NAME = `${CACHE_PREFIX}v3`;
const OFFLINE_PAGE = "./index.html";
const CORE_ASSETS = [
  "./",
  OFFLINE_PAGE,
  "./styles.css",
  "./app.js",
  "./manifest.webmanifest",
  "./icons/icon-192.svg",
  "./icons/icon-512.svg",
  "./docs/ETHICS.md"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(CORE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys
          .filter((key) => key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

function isCacheable(response) {
  return Boolean(
    response &&
    response.ok &&
    (response.type === "basic" || response.type === "default")
  );
}

async function cacheResponse(request, response) {
  if (!isCacheable(response)) return;
  const cache = await caches.open(CACHE_NAME);
  await cache.put(request, response.clone());
}

async function handleNavigation(event) {
  try {
    const response = await fetch(event.request);
    await cacheResponse(OFFLINE_PAGE, response);
    return response;
  } catch {
    return (await caches.match(OFFLINE_PAGE)) || new Response(
      "DR. S.BAITSO is offline and the terminal shell is unavailable.",
      { status: 503, headers: { "Content-Type": "text/plain; charset=utf-8" } }
    );
  }
}

async function handleAsset(event) {
  const cached = await caches.match(event.request);
  const revalidation = fetch(event.request).then(async (response) => {
    await cacheResponse(event.request, response);
    return response;
  });

  if (cached) {
    event.waitUntil(revalidation.catch(() => undefined));
    return cached;
  }

  return revalidation;
}

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  if (event.request.mode === "navigate") {
    event.respondWith(handleNavigation(event));
    return;
  }

  event.respondWith(handleAsset(event));
});