'use strict';
/* Cache only public static shell; no API requests or private vault data. */
if('serviceWorker' in navigator && location.protocol==='https:'){
window.addEventListener('load',()=>navigator.serviceWorker.register('./sw-r43.js').catch(()=>{}));
}
