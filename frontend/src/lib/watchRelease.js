// Keep a visible tab on the published release without disturbing hidden tabs.
export function watchRelease() {
  const current = document.querySelector('meta[name="dars-release"]')?.content;
  if (!current) return; // Development server, or HTML without a build marker.
  let pending = false;
  const key = 'dars:last-release-reload';
  async function check() {
    if (pending || document.visibilityState !== 'visible') return;
    pending = true;
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 10000);
    try {
      const response = await fetch('/release.json', { cache: 'no-store', signal: controller.signal });
      if (!response.ok) return;
      const { version } = await response.json();
      if (typeof version !== 'string' || !version || version === current ||
          document.visibilityState !== 'visible') return;
      // Avoid a reload loop if an intermediary temporarily serves stale HTML.
      try {
        const previous = JSON.parse(sessionStorage.getItem(key) || 'null');
        if (previous?.version === version && Date.now() - previous.time < 120000) return;
        sessionStorage.setItem(key, JSON.stringify({ version, time: Date.now() }));
      } catch {
        // Storage is optional. The next scheduled check is a minute away.
      }
      window.location.reload();
    } catch {
      // Offline, interrupted deploy or non-JSON fallback: keep the working page.
    } finally {
      window.clearTimeout(timeout);
      pending = false;
    }
  }
  window.setInterval(check, 60000);
  document.addEventListener('visibilitychange', check);
  window.addEventListener('focus', check);
  window.addEventListener('online', check);
  window.addEventListener('pageshow', event => { if (event.persisted) check(); });
}
