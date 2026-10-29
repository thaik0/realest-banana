const url = document.querySelector('#url'), status = document.querySelector('#status');
chrome.storage.local.get('trackerOrigin', ({trackerOrigin}) => { if (trackerOrigin) url.value = trackerOrigin; });
document.querySelector('#connect').onclick = async () => {
  try {
    const parsed = new URL(url.value);
    if (!['http:','https:'].includes(parsed.protocol)) throw Error('Use an HTTP or HTTPS tracker URL.');
    const origin = parsed.origin + '/*';
    if (!await chrome.permissions.request({origins:[origin]})) throw Error('Site access was not granted.');
    await chrome.scripting.unregisterContentScripts({ids:['tracker-bridge']}).catch(() => {});
    await chrome.scripting.registerContentScripts([{id:'tracker-bridge',matches:[origin],js:['bridge.js'],runAt:'document_idle'}]);
    await chrome.storage.local.set({trackerOrigin:parsed.origin});
    status.textContent = 'Connected. Reload your tracker to sync recorded games.';
  } catch (error) { status.textContent = error.message; }
};
