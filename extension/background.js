chrome.runtime.onMessage.addListener((message, sender, respond) => {
  if (message.type !== 'zetamac-session' || !sender.url?.startsWith('https://arithmetic.zetamac.com/game')) return;
  (async () => {
    const {sessions=[]} = await chrome.storage.local.get('sessions');
    if (!sessions.some(s => s.id === message.session.id)) {
      sessions.push(message.session);
      await chrome.storage.local.set({sessions});
    }
    respond({ok:true});
  })();
  return true;
});
