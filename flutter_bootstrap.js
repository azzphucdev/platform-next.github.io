/*
 * Migration stub. The old Flutter index.html loads `flutter_bootstrap.js?v=…`; a browser that still has that HTML
 * cached (GitHub Pages sends max-age=600) lands here after the switch to the Next.js build. Drop any Flutter service
 * worker / caches and reload once so the new index.html is fetched. Guarded so it can never reload in a loop.
 */
(function () {
  try {
    var KEY = 'pn_flutter_stub_reload';
    if (sessionStorage.getItem(KEY)) return;
    sessionStorage.setItem(KEY, '1');
    // a reload revalidates the document, so the cached Flutter index.html is replaced by the new one
    var done = function () {
      window.location.reload();
    };
    var jobs = [];
    if (navigator.serviceWorker && navigator.serviceWorker.getRegistrations) {
      jobs.push(
        navigator.serviceWorker.getRegistrations().then(function (rs) {
          return Promise.all(rs.map(function (r) { return r.unregister(); }));
        }),
      );
    }
    if (window.caches && caches.keys) {
      jobs.push(
        caches.keys().then(function (names) {
          return Promise.all(names.map(function (n) { return caches.delete(n); }));
        }),
      );
    }
    Promise.all(jobs).then(done, done);
  } catch (e) {
    /* storage blocked: do nothing rather than risk a loop */
  }
})();
