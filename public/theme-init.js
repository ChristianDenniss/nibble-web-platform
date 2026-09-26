// Force the light theme before first paint, including when an old dark preference is saved.
// Loaded externally so the CSP can keep script-src 'self' without 'unsafe-inline'.
(function () {
  var root = document.documentElement
  root.classList.remove('dark')
  root.classList.add('light')
  root.style.colorScheme = 'light'

  try {
    localStorage.setItem('theme', 'light')
  } catch {
    // The light class still applies when storage is unavailable.
  }
})()
