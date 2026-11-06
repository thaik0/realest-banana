(async()=>{
 const key='quant-tracker-v1';
 const banner=(message)=>{let n=document.createElement('div');n.style.cssText='position:fixed;z-index:9999;top:0;left:0;right:0;background:#832d31;color:white;padding:14px;text-align:center';n.textContent=message;document.body.appendChild(n)};
 let local;try{local=JSON.parse(localStorage.getItem(key))}catch{};
 try {
  const response=await fetch('/api/tracker',{cache:'no-store'});if(!response.ok)throw Error('Account storage unavailable');
  let remote=await response.json(), revision=remote.revision;
  let initial=remote.data||local||{problems:[],attempts:[]};

  if(!remote.data){try{initial.zetamac=JSON.parse(localStorage.getItem('quant-tracker-zetamac-v1'))||[]}catch{initial.zetamac=[]}}window.trackerInitial=initial;let queue=Promise.resolve(),blocked=false;
  window.syncTracker=(value)=>{let snapshot=JSON.stringify(value);queue=queue.then(async()=>{if(blocked)return;let res=await fetch('/api/tracker',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({data:JSON.parse(snapshot),revision})});if(!res.ok){blocked=true;banner('Account sync stopped. Your data remains in this browser. Refresh before making more changes.');return}revision=(await res.json()).revision}).catch(()=>{blocked=true;banner('Account sync failed. Your data remains in this browser.')})};
  if(remote.data || (local && ((local.problems||[]).length || (local.attempts||[]).length)) || (initial.zetamac||[]).length) window.syncTracker(initial);
  let script=document.createElement('script');script.src='/app.js';document.body.appendChild(script);
 }catch(e){banner('Could not connect to account storage. Your saved browser data was not changed.');}
})();
