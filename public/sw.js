const CACHE_PREFIX = `taskmanager-cache`;
const CACHE_VER = `v12.1`;
const CACHE_NAME = `${CACHE_PREFIX}-${CACHE_VER}`;

const HTTP_STATUS_OK = 200;
const RESPONSE_SAFE_TYPE = `basic`;

self.addEventListener(`install`, (evt) => {
  evt.waitUntil(
      caches.open(CACHE_NAME)
        .then((cache) => {
          return cache.addAll([
            `/`,
            `/index.html`,
            `/bundle.js`,
            `/fonts/HelveticaNeueCyr-Roman.woff`,
            `/fonts/HelveticaNeueCyr-Roman.woff2`,
            `/fonts/HelveticaNeueCyr-Medium.woff`,
            `/fonts/HelveticaNeueCyr-Medium.woff2`,
            `/fonts/HelveticaNeueCyr-Bold.woff`,
            `/fonts/HelveticaNeueCyr-Bold.woff2`,
            `/favicon/favicon.ico`,
            `/favicon/favicon.png`,
            `/css/normalize.css`,
            `/css/style.css`,
          ]);
        })
  );
});

self.addEventListener(`activate`, (evt) => {
  evt.waitUntil(
      caches.keys()
        .then((keys) => keys.Promise.all(
            keys
              .map((key) => {
                // удаляем ненужные кэши, которые относяться к приложению,
                // но не совпадают по версии
                if (key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME) {
                  return caches.delete(key);
                }

                // остальные не обрабатываем
                return null;
              })
              .filter((key) => key !== null)
        ))
  );
});

const handleFetch = (evt) => {
  const {request} = evt;

  evt.respondWith(
      caches.match(request)
        .then((cacheResponse) => {
          // если в кэше есть ответ на запрос
          // возвращаем его вместо запроса к серверу
          if (cacheResponse) {
            return cacheResponse;
          }

          // если в кэше нет ответа вызываем fetch
          // с тем же запросом и возвращаем его
          return fetch(request)
            .then((response) => {
              // если ответа нет, или отличный от 200,
              // или не безопасного типа (не basic), тогда передаем
              // ответ дальше, не обрабатывая
              if (!response
                || response.status !== HTTP_STATUS_OK
                || response.type !== RESPONSE_SAFE_TYPE
              ) {
                return response;
              }

              // если удовлетворяет условиям — клонируем его
              const clonedResponse = response.clone();

              // помещаем в кэш
              caches.open(CACHE_NAME)
                .then((cache) => cache.put(request, clonedResponse));

              // оригинал передается дальше
              return response;
            });

        })
  );
};

self.addEventListener(`fetch`, handleFetch);
