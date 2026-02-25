document.addEventListener('DOMContentLoaded', () => {
    var scriptLoaded = false;
    function loadMainDartJs() {
        if (scriptLoaded) {
            return;
        }
        scriptLoaded = true;
        var scriptTag = document.createElement('script');
        scriptTag.src = 'main.dart.js';
        scriptTag.type = 'application/javascript';
        document.body.append(scriptTag);
    }
    var currentUrl = window.location.href;
    if (!currentUrl.includes('localhost')) {
        var script = document.createElement('script');
        script.src = 'f12.js';
        script.defer = true;
        document.head.appendChild(script);
    }

    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
          const serviceWorkerUrl = `flutter_service_worker.js?v=${serviceWorkerVersion}`;
          navigator.serviceWorker.register(serviceWorkerUrl)
              .then((reg) => {
                  const handleActivation = (serviceWorker) => {
                      serviceWorker.addEventListener('statechange', () => {
                          if (serviceWorker.state === 'activated') {
                              console.log('Installed new service worker');
                              caches.keys()
                                  .then(cacheNames => Promise.all(cacheNames.map(cacheName => caches.delete(cacheName))))
                                  .then(() => console.log('Cache has been cleared'))
                                  .then(() => {
                                      //localStorage.clear();
                                      sessionStorage.clear();
                                  })
                                  .then(() => console.log('All storage has been cleared'))
                                  .then(loadMainDartJs);
                          }
                      });
                  };

                  if (!reg.active) {
                      const worker = reg.installing || reg.waiting;
                      if (worker) handleActivation(worker);
                  } else if (!reg.active.scriptURL.endsWith(serviceWorkerVersion)) {
                      console.log('New service worker available');
                      reg.update();
                      handleActivation(reg.installing);
                  } else {
                      console.log('Loading app from service worker');
                      loadMainDartJs();
                  }
              })
              .catch(error => {
                  console.warn('Service worker registration failed:', error);
                  loadMainDartJs();
              });
      });
    } else {
        loadMainDartJs();
    }
});