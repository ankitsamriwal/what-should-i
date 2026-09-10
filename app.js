/* What Should I - shell: home grid of categories, drill-in panes */
(function(){
  var ALLOW = 'camera; microphone; geolocation; clipboard-write; notifications';
  var stage = document.getElementById('stage');
  var home = document.getElementById('pane-home');
  var panes = {};
  WSI_CATS.forEach(function(c){ panes[c.id] = document.getElementById('pane-'+c.id); });
  var current = 'home';
  var iframes = {};
  var depth = {};      // iframe child depth via postMessage
  var ndepth = {};     // native category depth (0=category root)
  WSI_CATS.forEach(function(c){ depth[c.id]=0; ndepth[c.id]=0; });

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
    try { history.pushState({wsi:current, shield:true}, '', current==='home'?'#home':'#'+current); } catch(e){}
  }

  /* ---------- home grid ---------- */
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

  /* ---------- iframe panes (wear/eat/watch) ---------- */
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

  /* ---------- native categories ---------- */
  function st(cat){
    var s = null;
    try { s = JSON.parse(localStorage.getItem('wsi-'+cat) || 'null'); } catch(e){}
    if (!s) s = {prefs:{}, rolls:{}};
    return s;
  }
  function saveSt(cat, s){ try { localStorage.setItem('wsi-'+cat, JSON.stringify(s)); } catch(e){} }
  function esc(x){ return String(x).replace(/[&<>"]/g, function(m){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]; }); }
  function seedRand(seed){ var x = 0; for (var i=0;i<seed.length;i++) x = (x*31 + seed.charCodeAt(i)) >>> 0; return function(){ x = (x*1103515245 + 12345) >>> 0; return x / 4294967296; }; }
  function dstr(off){ var d=new Date(); d.setDate(d.getDate()+off); return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0'); }
  function filtered(cat){
    var s = st(cat), d = WSI_DATA[cat];
    var chosen = [];
    d.prefs.forEach(function(p){ if (s.prefs[p.key]) chosen.push(s.prefs[p.key]); });
    if (!chosen.length) return d.items;
    var f = d.items.filter(function(it){ return chosen.every(function(c){ return it.t.indexOf(c) >= 0; }); });
    return f.length ? f : d.items;
  }
  function dayPick(cat, off){
    var pool = filtered(cat);
    var r = seedRand(cat + '|' + dstr(off) + '|' + JSON.stringify(st(cat).prefs));
    return pool[Math.floor(r()*pool.length)];
  }
  function renderNative(cat){
    var pane = panes[cat], c = null;
    WSI_CATS.forEach(function(x){ if (x.id===cat) c=x; });
    var s = st(cat), d = WSI_DATA[cat];
    var h = '<div class="nwrap">';
    h += '<div class="nhead"><h2>'+c.q+'</h2></div>';
    /* prefs chips */
    d.prefs.forEach(function(p){
      h += '<div class="pq"><div class="pl">'+esc(p.label)+'</div><div class="chips">';
      p.opts.forEach(function(o){
        var on = s.prefs[p.key] === o;
        h += '<button class="chip'+(on?' on':'')+'" data-k="'+p.key+'" data-v="'+esc(o)+'" type="button">'+esc(o)+'</button>';
      });
      h += '</div></div>';
    });
    /* today's pick */
    var today = dayPick(cat, 0);
    h += '<div class="pickcard"><div class="pk-label">'+(cat==='go'?'Tonight':'Today')+'</div><div class="pk-name">'+esc(today.n)+'</div>' +
         '<button class="cta ghost" id="reroll" type="button">&#10227; Another idea</button></div>';
    /* week strip */
    h += '<h3>The week ahead</h3><div class="wklist">';
    d.days.forEach(function(lbl, i){
      var p = dayPick(cat, i);
      h += '<div class="wkrow"><span class="wkd">'+esc(lbl)+'</span><span class="wkn">'+esc(p.n)+'</span></div>';
    });
    h += '</div>';
    h += '<div class="note-soft">Picks follow your chips above and change every day.</div>';
    h += '</div>';
    pane.innerHTML = h;
    Array.prototype.forEach.call(pane.querySelectorAll('.chip'), function(b){
      b.addEventListener('click', function(){
        var s2 = st(cat);
        if (s2.prefs[b.dataset.k] === b.dataset.v) delete s2.prefs[b.dataset.k];
        else s2.prefs[b.dataset.k] = b.dataset.v;
        saveSt(cat, s2); renderNative(cat);
      });
    });
    pane.querySelector('#reroll').addEventListener('click', function(){
      var pool = filtered(cat);
      var s2 = st(cat);
      var cur = dayPick(cat, 0).n;
      var alt = pool.filter(function(it){ return it.n !== cur; });
      if (!alt.length) return;
      var pick = alt[Math.floor(Math.random()*alt.length)];
      /* remember the manual override for today */
      s2.rolls[dstr(0)] = pick.n; saveSt(cat, s2);
      var el = pane.querySelector('.pk-name'); el.textContent = pick.n;
    });
    ndepth[cat] = 0;
  }
  /* manual reroll override should beat deterministic pick */
  var _dayPick = dayPick;
  dayPick = function(cat, off){
    var s = st(cat);
    if (off === 0 && s.rolls[dstr(0)]) {
      var n = s.rolls[dstr(0)];
      for (var i=0;i<WSI_DATA[cat].items.length;i++) if (WSI_DATA[cat].items[i].n === n) return WSI_DATA[cat].items[i];
    }
    return _dayPick(cat, off);
  };

  /* ---------- navigation ---------- */
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
    if (current === 'home') { /* nothing to load */ }
    else {
      var pane = panes[current];
      var cat = null; WSI_CATS.forEach(function(x){ if (x.id===current) cat=x; });
      if (cat.iframe) loadPane(pane); else renderNative(current);
    }
    try { history.replaceState({wsi:current}, '', '#'+current); } catch(e){}
    try { localStorage.setItem('wsi-last-cat', current); } catch(e){}
  }
  function goHome(){ select('home'); }
  document.getElementById('homebtn').addEventListener('click', goHome);

  window.addEventListener('popstate', function(){
    if (current === 'home') return; // let the app exit
    var cat = null; WSI_CATS.forEach(function(x){ if (x.id===current) cat=x; });
    if (cat && cat.iframe) {
      var f = iframes[current];
      if ((depth[current]||0) > 0 && f) {
        f.contentWindow.postMessage({t:'ak-back'}, '*');
        armShield();
        return;
      }
    }
    if (cat && !cat.iframe && (ndepth[current]||0) > 0) { ndepth[current]--; armShield(); return; }
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
