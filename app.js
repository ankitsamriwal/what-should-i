/* What Should I - tab shell */
(function(){
  var TABS = ['wear','eat','watch'];
  var ALLOW = 'camera; microphone; geolocation; clipboard-write';
  var stage = document.getElementById('stage');
  var panes = {};
  TABS.forEach(function(t){ panes[t] = document.getElementById('pane-'+t); });
  var buttons = Array.prototype.slice.call(document.querySelectorAll('.segbtn'));
  var current = null;

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
    if (push !== false) {
      try { history.pushState({tab:tab}, '', '#'+tab); } catch(e){}
    }
  }

  buttons.forEach(function(b){
    b.addEventListener('click', function(){ select(b.dataset.tab); });
  });
  window.addEventListener('popstate', function(ev){
    var tab = (ev.state && ev.state.tab) || location.hash.replace('#','') || 'wear';
    select(tab, false);
  });

  var start = location.hash.replace('#','');
  if (TABS.indexOf(start) < 0) {
    try { start = localStorage.getItem('wsi-last-tab') || 'wear'; } catch(e){ start = 'wear'; }
  }
  select(start, false);
  try { history.replaceState({tab:current}, '', '#'+current); } catch(e){}
  window.addEventListener('pagehide', function(){
    try { localStorage.setItem('wsi-last-tab', current); } catch(e){}
  });

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(function(){});
  }
})();
