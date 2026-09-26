// Applies the persisted (or OS-preferred) theme before first paint, so there's no flash of the
// wrong theme on load. Loaded as a same-origin external script (not inlined in index.html) so the
// CSP's script-src can stay 'self' with no 'unsafe-inline' - see frontend/nginx.conf.
(function () {
  var t = localStorage.getItem('theme')
  if (t === 'dark' || (!t && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark')
  }
})()
