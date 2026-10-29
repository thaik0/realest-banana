// Each navigation to the game starts a new session, including Try again.
const sessionId = crypto.randomUUID();
let observedRunning = false, sent = false;
function inspect() {
  const left = document.querySelector('#game .left');
  const end = document.querySelector('#game .end');
  const score = end?.querySelector('.correct');
  if (!left || !end || !score) return;
  const timer = left.textContent.match(/Seconds left:\s*(\d+)/i);
  const seconds = timer ? Number(timer[1]) : null;
  if (seconds > 0) observedRunning = true;
  const visible = getComputedStyle(end).display !== 'none' && getComputedStyle(end).visibility !== 'hidden';
  const match = score.textContent.match(/Score:\s*(\d+)/i);
  if (!sent && observedRunning && visible && match && (seconds === 0 || !timer)) {
    sent = true;
    chrome.runtime.sendMessage({type:'zetamac-session', session:{id:sessionId,score:Number(match[1]),timestamp:new Date().toISOString(),duration:120,source:'zetamac'}}).catch(() => { sent = false; });
  }
}
new MutationObserver(inspect).observe(document.documentElement,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['style','class']});
inspect();
