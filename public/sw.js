if(!self.define){let e,s={};const i=(i,n)=>(i=new URL(i+".js",n).href,s[i]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=i,e.onload=s,document.head.appendChild(e)}else e=i,importScripts(i),s()})).then((()=>{let e=s[i];if(!e)throw new Error(`Module ${i} didn’t register its module`);return e})));self.define=(n,a)=>{const t=e||("document"in self?document.currentScript.src:"")||location.href;if(s[t])return;let c={};const f=e=>i(e,t),r={module:{uri:t},exports:c,require:f};s[t]=Promise.all(n.map((e=>r[e]||f(e)))).then((e=>(a(...e),c)))}}define(["./workbox-4754cb34"],(function(e){"use strict";importScripts(),self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"/_next/app-build-manifest.json",revision:"2829e20d3c98c85ff01a1e718e353dc6"},{url:"/_next/static/-d1zzH3MT4KhSu8ivhffs/_buildManifest.js",revision:"a724fbc38e6e0ca8d35c152d3cceb09e"},{url:"/_next/static/-d1zzH3MT4KhSu8ivhffs/_ssgManifest.js",revision:"b6652df95db52feb4daf4eca35380933"},{url:"/_next/static/chunks/203.2b4c1ee4fbe3a7cf.js",revision:"2b4c1ee4fbe3a7cf"},{url:"/_next/static/chunks/218.57a830a2c55ba802.js",revision:"57a830a2c55ba802"},{url:"/_next/static/chunks/4bd1b696-9924fae48e609361.js",revision:"-d1zzH3MT4KhSu8ivhffs"},{url:"/_next/static/chunks/517-a797439bf6dd07e7.js",revision:"-d1zzH3MT4KhSu8ivhffs"},{url:"/_next/static/chunks/558-c9a6fc4541e0ef32.js",revision:"-d1zzH3MT4KhSu8ivhffs"},{url:"/_next/static/chunks/615-d39a5efaba31d6ed.js",revision:"-d1zzH3MT4KhSu8ivhffs"},{url:"/_next/static/chunks/782-d665f28c363f7701.js",revision:"-d1zzH3MT4KhSu8ivhffs"},{url:"/_next/static/chunks/807-c54b5d01c781283b.js",revision:"-d1zzH3MT4KhSu8ivhffs"},{url:"/_next/static/chunks/868-8aaeceea4df048d4.js",revision:"-d1zzH3MT4KhSu8ivhffs"},{url:"/_next/static/chunks/918-938e9955687d0961.js",revision:"-d1zzH3MT4KhSu8ivhffs"},{url:"/_next/static/chunks/9eeab064-c05d42e33c4656c5.js",revision:"-d1zzH3MT4KhSu8ivhffs"},{url:"/_next/static/chunks/app/_not-found/page-80f2ab645733973c.js",revision:"-d1zzH3MT4KhSu8ivhffs"},{url:"/_next/static/chunks/app/api/auth/%5B...nextauth%5D/route-183d4bb88fb96427.js",revision:"-d1zzH3MT4KhSu8ivhffs"},{url:"/_next/static/chunks/app/api/auth/login/page-0737f37c923a5619.js",revision:"-d1zzH3MT4KhSu8ivhffs"},{url:"/_next/static/chunks/app/layout-ef58d1e4ae5000d3.js",revision:"-d1zzH3MT4KhSu8ivhffs"},{url:"/_next/static/chunks/app/page-952afbda69f6647f.js",revision:"-d1zzH3MT4KhSu8ivhffs"},{url:"/_next/static/chunks/app/signin/page-6b2051f7353c5efb.js",revision:"-d1zzH3MT4KhSu8ivhffs"},{url:"/_next/static/chunks/app/signup/page-41c007d4a70c163c.js",revision:"-d1zzH3MT4KhSu8ivhffs"},{url:"/_next/static/chunks/app/test/page-6ed61722e47f67c9.js",revision:"-d1zzH3MT4KhSu8ivhffs"},{url:"/_next/static/chunks/bc9e92e6-ad0e28da21ec23ec.js",revision:"-d1zzH3MT4KhSu8ivhffs"},{url:"/_next/static/chunks/framework-6b27c2b7aa38af2d.js",revision:"-d1zzH3MT4KhSu8ivhffs"},{url:"/_next/static/chunks/main-app-b4241f039544016c.js",revision:"-d1zzH3MT4KhSu8ivhffs"},{url:"/_next/static/chunks/main-ebecd1b30b937adc.js",revision:"-d1zzH3MT4KhSu8ivhffs"},{url:"/_next/static/chunks/pages/_app-430fec730128923e.js",revision:"-d1zzH3MT4KhSu8ivhffs"},{url:"/_next/static/chunks/pages/_error-2d7241423c4a35ba.js",revision:"-d1zzH3MT4KhSu8ivhffs"},{url:"/_next/static/chunks/polyfills-42372ed130431b0a.js",revision:"846118c33b2c0e922d7b3a7676f81f6f"},{url:"/_next/static/chunks/webpack-4aade61f79803b20.js",revision:"-d1zzH3MT4KhSu8ivhffs"},{url:"/_next/static/css/4dad865edd694cf6.css",revision:"4dad865edd694cf6"},{url:"/_next/static/media/569ce4b8f30dc480-s.p.woff2",revision:"ef6cefb32024deac234e82f932a95cbd"},{url:"/_next/static/media/ba015fad6dcf6784-s.woff2",revision:"8ea4f719af3312a055caf09f34c89a77"},{url:"/file.svg",revision:"d09f95206c3fa0bb9bd9fefabfd0ea71"},{url:"/globe.svg",revision:"2aaafa6a49b6563925fe440891e32717"},{url:"/next.svg",revision:"8e061864f388b47f33a1c3780831193e"},{url:"/vercel.svg",revision:"c0af2f507b369b085b35ef4bbe3bcf1e"},{url:"/window.svg",revision:"a2760511c65806022ad20adf74370ff3"}],{ignoreURLParametersMatching:[]}),e.cleanupOutdatedCaches(),e.registerRoute("/",new e.NetworkFirst({cacheName:"start-url",plugins:[{cacheWillUpdate:async({request:e,response:s,event:i,state:n})=>s&&"opaqueredirect"===s.type?new Response(s.body,{status:200,statusText:"OK",headers:s.headers}):s}]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,new e.CacheFirst({cacheName:"google-fonts-webfonts",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:31536e3})]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,new e.StaleWhileRevalidate({cacheName:"google-fonts-stylesheets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,new e.StaleWhileRevalidate({cacheName:"static-font-assets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,new e.StaleWhileRevalidate({cacheName:"static-image-assets",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/image\?url=.+$/i,new e.StaleWhileRevalidate({cacheName:"next-image",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp3|wav|ogg)$/i,new e.CacheFirst({cacheName:"static-audio-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp4)$/i,new e.CacheFirst({cacheName:"static-video-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:js)$/i,new e.StaleWhileRevalidate({cacheName:"static-js-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:css|less)$/i,new e.StaleWhileRevalidate({cacheName:"static-style-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/data\/.+\/.+\.json$/i,new e.StaleWhileRevalidate({cacheName:"next-data",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:json|xml|csv)$/i,new e.NetworkFirst({cacheName:"static-data-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;const s=e.pathname;return!s.startsWith("/api/auth/")&&!!s.startsWith("/api/")}),new e.NetworkFirst({cacheName:"apis",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:16,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;return!e.pathname.startsWith("/api/")}),new e.NetworkFirst({cacheName:"others",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>!(self.origin===e.origin)),new e.NetworkFirst({cacheName:"cross-origin",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:3600})]}),"GET")}));
