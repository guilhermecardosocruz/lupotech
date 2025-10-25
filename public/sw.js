// SW mínimo: não intercepta nada (logo, não cacheia /api/**)
self.addEventListener('install', (event) => { self.skipWaiting(); });
self.addEventListener('activate', (event) => { self.clients.claim(); });
// Sem fetch handler => sem cache de rede.
