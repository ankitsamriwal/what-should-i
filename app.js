/* What Should I - tab shell */
(function(){
  var TABS = ['wear','eat','watch'];
  var ALLOW = 'camera; microphone; geolocation; clipboard-write';
  var stage = document.getElementById('stage');
  var panes = {};
  TABS.forEach(function(t){ panes[t] = document.getElementById('pane-'+t); });
  var buttons = Array.prototype.slice.call(document.querySelectorAll('.segbtn'));
  var current = null;
  var iframes = {};
  var depth = {wear:0, eat:0, watch:0};
  window.addEventListener('message', function(ev){
    TABS.forEach(function(t){
      var f = iframes[t];
      if (f && ev.source === f.contentWindow) {
        var d = ev.data || {};
        if (d.t === 'ak-nav') depth[t] = d.depth | 0;
      }
    });
  });
  function armShield(){
    try { history.pushState({tab:current, shield:true}, '', '#'+current); } catch(e){}
  }

  function loadPane(pane){
    if (pane.dataset.loaded) return;
    pane.dataset.loaded = '1';
    var veil = document.createElement('div');
    veil.className = 'veil';
    veil.innerHTML = '<div class="spin"></div><div>Loading ' + pane.dataset.name + '&hellip;</div>';
    pane.appendChild(veil);
    var f = document.createElement('iframe');
    f.setAttribute('allow', ALLOW);
    f.setAttribute('allowfullscreen', '');
    f.setAttribute('title', pane.dataset.name);
    var settled = false;
    var timer = setTimeout(function(){
      if (settled) return;
      veil.innerHTML = '<div>Taking longer than usual.</div>' +
        '<button class="retry" type="button">Retry</button>';
      veil.querySelector('.retry').addEventListener('click', function(){
        delete pane.dataset.loaded;
        pane.innerHTML = '';
        loadPane(pane);
      });
    }, 12000);
    f.addEventListener('load', function(){
      settled = true;
      clearTimeout(timer);
      veil.hidden = true;
    });
    iframes[pane.id.replace('pane-','')] = f;
    f.src = pane.dataset.url;
    pane.appendChild(f);
  }

  function select(tab, push){
    if (!panes[tab]) tab = 'wear';
    if (tab === current) return;
    current = tab;
    TABS.forEach(function(t){
      panes[t].classList.toggle('active', t === tab);
    });
    buttons.forEach(function(b){
      var on = b.dataset.tab === tab;
      b.classList.toggle('active', on);
      b.setAttribute('aria-selected', on ? 'true' : 'false');
    });
    loadPane(panes[tab]);
    try { history.replaceState({tab:tab}, '', '#'+tab); } catch(e){}
  }

  buttons.forEach(function(b){
    b.addEventListener('click', function(){ select(b.dataset.tab); });
  });
  window.addEventListener('popstate', function(ev){
    var d = depth[current] || 0;
    var f = iframes[current];
    if (d > 0 && f) {
      f.contentWindow.postMessage({t:'ak-back'}, '*');
      armShield(); // re-arm so the next back also lands here
    }
    // depth 0: at the tab's root - no re-arm, so the next back exits the app
  });

  var start = location.hash.replace('#','');
  if (TABS.indexOf(start) < 0) {
    try { start = localStorage.getItem('wsi-last-tab') || 'wear'; } catch(e){ start = 'wear'; }
  }
  select(start, false);
  try { history.replaceState({tab:current}, '', '#'+current); } catch(e){}
  armShield();
  window.addEventListener('pagehide', function(){
    try { localStorage.setItem('wsi-last-tab', current); } catch(e){}
  });

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(function(){});
  }
})();
