self.addEventListener('install', function () {
  self.skipWaiting();
});

self.addEventListener('activate', function (e) {
  e.waitUntil(self.clients.claim());
});

self.addEventListener('message', function (e) {
  var data = e.data;
  if (!data || data.type !== 'GOAL_NOTIFY') return;
  var title = data.title || 'Full Potentiall';
  var options = {
    body: data.body || '',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    tag: data.tag || 'goal-step',
    renotify: true,
    data: { tag: data.tag }
  };
  e.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', function (e) {
  e.notification.close();
  e.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (list) {
      if (list.length) {
        list[0].focus();
        return;
      }
      return self.clients.openWindow('/');
    })
  );
});

self.addEventListener('fetch', function () {
  /* cache/network handled by host */
});
