importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.1.1/workbox-sw.js');

if (workbox) {
  console.log('Workbox is loaded');
  workbox.precaching.precacheAndRoute([]);
  workbox.routing.registerRoute('/api/news',
    new workbox.strategies.StaleWhileRevalidate({
      cacheName: 'api-cache'
    })
  );

  const cloudinaryPlugin = {
    requestWillFetch: async ({ request }) => {
      if (/\.jpg$|\.png$|\.gif$|\.webp$/.test(request.url)) {
        let url = request.url.split('/');
        let newPart;
        let format = 'f_auto';
        switch ((navigator && navigator.connection) ? navigator.connection.effectiveType : '') {
          case '4g':
            newPart = 'q_auto:good';
          break;
    
          case '3g':
            newPart = 'q_auto:eco';
          break;
    
          case'2g':
          case 'slow-2g':
            newPart = 'q_auto:low';
          break;
    
          default:
            newPart = 'q_auto:good';
          break;
        }
    
        url.splice(url.length - 2, 0, `${newPart},${format}`);
        const finalUrl = url.join('/');

        const newUrl = new URL(finalUrl);
        return new Request(newUrl.href, { headers: request.headers });
      }
    },
  };

  workbox.routing.registerRoute(
    new RegExp('^https:\/\/res\.cloudinary\.com'),
    
    new workbox.strategies.CacheFirst({
      cacheName: 'cloudinary-images',
      plugins: [
        cloudinaryPlugin,
        new workbox.expiration.Plugin({
          maxEntries: 50,
          purgeOnQuotaError: true,
        }),
      ],
    })
  );
} else {
  console.log('Could not load Workbox');
}
