var REMINDER_CACHE = 'fp-goal-reminders-v2';
var REMINDER_URL = '/__fp_goal_reminders__';
var CHECK_WINDOW_MS = 12 * 60 * 1000;

self.addEventListener('install', function () {
  self.skipWaiting();
});

self.addEventListener('activate', function (e) {
  e.waitUntil(self.clients.claim());
});

async function loadReminders() {
  try {
    var cache = await caches.open(REMINDER_CACHE);
    var res = await cache.match(REMINDER_URL);
    if (!res) return [];
    return JSON.parse(await res.text());
  } catch (e) {
    return [];
  }
}

async function saveReminders(items) {
  var cache = await caches.open(REMINDER_CACHE);
  await cache.put(REMINDER_URL, new Response(JSON.stringify(items || [])));
}

async function mergeAndSaveReminders(incoming) {
  var list = incoming || [];
  var existing = await loadReminders();
  var firedByTag = {};
  existing.forEach(function (item) {
    if (item.fired && item.tag) firedByTag[item.tag] = true;
  });
  list.forEach(function (item) {
    if (item.fired || firedByTag[item.tag]) item.fired = true;
  });
  await saveReminders(list);
  return list;
}

function notifyClientsFired(item) {
  return self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (clients) {
    clients.forEach(function (client) {
      client.postMessage({
        type: 'GOAL_REMINDER_FIRED',
        tag: item.tag,
        goalId: item.goalId
      });
    });
  });
}

async function showGoalNotification(item) {
  return self.registration.showNotification(item.title || 'Full Potentiall', {
    body: item.body || '',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    tag: item.tag || 'goal-step',
    renotify: true,
    data: { tag: item.tag, goalId: item.goalId }
  });
}

async function checkDueReminders() {
  var items = await loadReminders();
  if (!items.length) return;
  var now = Date.now();
  var changed = false;
  for (var i = 0; i < items.length; i++) {
    var item = items[i];
    if (item.fired) continue;
    if (now < item.at) continue;
    if (now - item.at > CHECK_WINDOW_MS) continue;
    try {
      await showGoalNotification(item);
      item.fired = true;
      changed = true;
      await notifyClientsFired(item);
    } catch (e) {}
  }
  if (changed) await saveReminders(items);
}

self.addEventListener('message', function (e) {
  var data = e.data;
  if (!data) return;

  if (data.type === 'GET_GOAL_REMINDERS' && e.ports && e.ports[0]) {
    e.waitUntil(
      loadReminders().then(function (items) {
        e.ports[0].postMessage(items);
      })
    );
    return;
  }

  if (data.type === 'SYNC_GOAL_REMINDERS') {
    e.waitUntil(
      mergeAndSaveReminders(data.items || []).then(function () {
        return checkDueReminders();
      })
    );
    return;
  }

  if (data.type === 'GOAL_NOTIFY') {
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
    return;
  }
});

self.addEventListener('sync', function (e) {
  if (e.tag === 'goal-reminders-check') {
    e.waitUntil(checkDueReminders());
  }
});

self.addEventListener('periodicsync', function (e) {
  if (e.tag === 'goal-reminders') {
    e.waitUntil(checkDueReminders());
  }
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

self.addEventListener('fetch', function () {});
