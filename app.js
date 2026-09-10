/* What Should I - shell: home grid of categories, drill-in panes */
(function(){
  var ALLOW = 'camera; microphone; geolocation; clipboard-write; notifications';
  var home = document.getElementById('pane-home');
  var panes = {};
  WSI_CATS.forEach(function(c){ panes[c.id] = document.getElementById('pane-'+c.id); });
  var current = 'home';
  var iframes = {};
  var depth = {};
  WSI_CATS.forEach(function(c){ depth[c.id]=0; });

  window.addEventListener('message', function(ev){
    WSI_CATS.forEach(function(c){
      var f = iframes[c.id];
      if (f && ev.source === f.contentWindow) {
        var d = ev.data || {};
        if (d.t === 'ak-nav') depth[c.id] = d.depth | 0;
      }
    });
  });

  function armShield(){
    try { history.pushState({wsi:current, shield:true}, '', '#'+current); } catch(e){}
  }

  function renderHome(){
    var h = '<div class="ghero"><h1>What should I&hellip;</h1><div class="gsub">Pick a question. Get an answer.</div></div><div class="grid">';
    WSI_CATS.forEach(function(c){
      h += '<button class="gcard" data-cat="'+c.id+'" type="button">' +
        '<span class="gic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+c.icon+'</svg></span>' +
        '<span class="gn">'+c.name+'</span><span class="gs">'+c.sub+'</span></button>';
    });
    h += '</div>';
    home.innerHTML = h;
    Array.prototype.forEach.call(home.querySelectorAll('.gcard'), function(b){
      b.addEventListener('click', function(){ select(b.dataset.cat); });
    });
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
      veil.innerHTML = '<div>Taking longer than usual.</div><button class="retry" type="button">Retry</button>';
      veil.querySelector('.retry').addEventListener('click', function(){
        delete pane.dataset.loaded; pane.innerHTML = ''; loadPane(pane);
      });
    }, 12000);
    f.addEventListener('load', function(){ settled = true; clearTimeout(timer); veil.hidden = true; });
    iframes[pane.id.replace('pane-','')] = f;
    f.src = pane.dataset.url;
    pane.appendChild(f);
  }

  function setBar(){
    document.getElementById('bar-home').hidden = current !== 'home';
    document.getElementById('bar-cat').hidden = current === 'home';
    if (current !== 'home') {
      var c = null; WSI_CATS.forEach(function(x){ if (x.id===current) c=x; });
      document.getElementById('bar-title').textContent = c.name;
    }
  }
  function select(tab){
    current = panes[tab] ? tab : 'home';
    Object.keys(panes).forEach(function(t){ panes[t].classList.toggle('active', t===current); });
    home.classList.toggle('active', current==='home');
    setBar();
    if (current !== 'home') loadPane(panes[current]);
    try { history.replaceState({wsi:current}, '', '#'+current); } catch(e){}
    try { localStorage.setItem('wsi-last-cat', current); } catch(e){}
  }
  document.getElementById('homebtn').addEventListener('click', function(){ select('home'); });

  window.addEventListener('popstate', function(){
    if (current === 'home') return; // at the top - let the app exit
    var f = iframes[current];
    if ((depth[current]||0) > 0 && f) {
      f.contentWindow.postMessage({t:'ak-back'}, '*');
      armShield();
      return;
    }
    select('home'); armShield();
  });

  renderHome();
  var start = location.hash.replace('#','');
  var known = {home:1}; WSI_CATS.forEach(function(c){ known[c.id]=1; });
  if (!known[start]) { try { start = localStorage.getItem('wsi-last-cat') || 'home'; } catch(e){ start = 'home'; } }
  select(start);
  armShield();

  if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(function(){});
})();
