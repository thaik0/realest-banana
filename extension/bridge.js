function sync() {
  if (!document.querySelector('meta[name="quant-tracker-app"]')) return;
  chrome.storage.local.get('sessions', ({sessions=[]}) => {
    window.postMessage({type:'quant-tracker-zetamac-sessions',sessions}, location.origin);
  });
}
sync();
chrome.storage.onChanged.addListener((changes, area) => { if (area === 'local' && changes.sessions) sync(); });
window.addEventListener('message', event => { if (event.source === window && event.origin === location.origin && event.data?.type === 'quant-tracker-zetamac-request') sync(); });
