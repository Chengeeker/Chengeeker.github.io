/**
 * APlayer Frosted Glass - Draggable & Edge Docking Engine
 * Supports pointer-based free 2D dragging, 8px edge contact snapping,
 * draggable lyrics HUD, Meting caching acceleration, and state persistence.
 */
(function() {
  'use strict';

  var STORAGE_KEY = 'aplayer-dock-position';
  var state = {
    isDocked: false,
    dockSide: 'left',
    posX: null,
    posY: null
  };

  try {
    var saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      var parsed = JSON.parse(saved);
      if (parsed && typeof parsed === 'object') {
        state = Object.assign(state, parsed);
      }
    }
  } catch (e) {}

  function getPlayer() {
    return document.querySelector('.aplayer.aplayer-fixed');
  }

  function dockPlayer(side, posY) {
    var player = getPlayer();
    if (!player) return;
    state.isDocked = true;
    state.dockSide = side || state.dockSide || 'left';
    if (typeof posY === 'number') {
      state.posY = posY;
    }

    player.classList.remove('aplayer-docked-left', 'aplayer-docked-right', 'aplayer-dragging', 'aplayer-custom-pos');
    
    player.style.removeProperty('left');
    player.style.removeProperty('right');

    if (state.posY !== null && state.posY !== undefined) {
      var vh = window.innerHeight;
      var clampedY = Math.max(10, Math.min(vh - 66, state.posY));
      player.style.setProperty('top', clampedY + 'px', 'important');
      player.style.setProperty('bottom', 'auto', 'important');
    } else {
      player.style.removeProperty('top');
      player.style.removeProperty('bottom');
    }

    if (state.dockSide === 'left') {
      player.classList.add('aplayer-docked-left');
    } else {
      player.classList.add('aplayer-docked-right');
    }

    var list = player.querySelector('.aplayer-list');
    if (list) list.classList.add('aplayer-list-hide');

    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) {}
  }

  function undockPlayer(customX, customY) {
    var player = getPlayer();
    if (!player) return;
    state.isDocked = false;
    player.classList.remove('aplayer-docked-left', 'aplayer-docked-right', 'aplayer-dragging');
    
    var vw = window.innerWidth;
    var vh = window.innerHeight;
    var w = player.offsetWidth || 440;
    var h = player.offsetHeight || 66;

    if (typeof customX === 'number' && typeof customY === 'number') {
      state.posX = Math.max(0, Math.min(vw - w, customX));
      state.posY = Math.max(0, Math.min(vh - h, customY));
      player.classList.add('aplayer-custom-pos');
      player.style.setProperty('left', state.posX + 'px', 'important');
      player.style.setProperty('top', state.posY + 'px', 'important');
      player.style.setProperty('bottom', 'auto', 'important');
      player.style.setProperty('right', 'auto', 'important');
    } else if (state.posX !== null && state.posY !== null) {
      player.classList.add('aplayer-custom-pos');
      player.style.setProperty('left', Math.max(0, Math.min(vw - w, state.posX)) + 'px', 'important');
      player.style.setProperty('top', Math.max(0, Math.min(vh - h, state.posY)) + 'px', 'important');
      player.style.setProperty('bottom', 'auto', 'important');
      player.style.setProperty('right', 'auto', 'important');
    } else {
      player.classList.remove('aplayer-custom-pos');
      player.style.removeProperty('top');
      player.style.removeProperty('bottom');
      player.style.removeProperty('left');
      player.style.removeProperty('right');
    }

    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) {}
  }

  window.APlayerDock = {
    dock: dockPlayer,
    undock: undockPlayer,
    getState: function() { return state; }
  };

  function getAPlayerInstance(targetPlayer) {
    var p = targetPlayer || getPlayer();
    if (p && p._aplayer) return p._aplayer;
    if (window.aplayers && window.aplayers.length > 0) {
      if (p) {
        for (var i = 0; i < window.aplayers.length; i++) {
          var inst = window.aplayers[i];
          if (inst && (inst.element === p || inst.container === p || (inst.element && p.contains(inst.element)))) {
            return inst;
          }
        }
      }
      return window.aplayers[0];
    }
    return null;
  }

  function initPlayerDock() {
    var player = getPlayer();
    if (!player) return;

    if (player.dataset.dockInitialized === 'true') {
      // Re-sync position on re-entry (e.g. PJAX)
      if (state.isDocked) {
        dockPlayer(state.dockSide, state.posY);
      } else if (state.posX !== null && state.posY !== null) {
        undockPlayer(state.posX, state.posY);
      }
      return;
    }
    player.dataset.dockInitialized = 'true';

    // Restore saved position/docked state from localStorage on startup
    if (state.isDocked) {
      dockPlayer(state.dockSide, state.posY);
    } else if (state.posX !== null && state.posY !== null) {
      undockPlayer(state.posX, state.posY);
    }

    var body = player.querySelector('.aplayer-body');
    var lrc = document.querySelector('.aplayer.aplayer-fixed .aplayer-lrc');
    var pic = player.querySelector('.aplayer-pic');

    // Sync play/pause state classes
    function syncPlayingClass() {
      var ap = getAPlayerInstance(player);
      if (ap) {
        if (!ap.paused) {
          player.classList.add('aplayer-playing');
        } else {
          player.classList.remove('aplayer-playing');
        }
      }
    }

    var apInstance = getAPlayerInstance(player);
    if (apInstance) {
      apInstance.on('play', function() { player.classList.add('aplayer-playing'); });
      apInstance.on('pause', function() { player.classList.remove('aplayer-playing'); });
      syncPlayingClass();
    }

    // Inject sidebar dock icon into controller
    function injectDockButton() {
      var timeWrap = player.querySelector('.aplayer-time');
      if (timeWrap && !timeWrap.querySelector('.aplayer-icon-dock')) {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'aplayer-icon aplayer-icon-dock';
        btn.title = '贴边收起/展开 (可自由拖拽吸附)';
        btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="15" height="15" fill="currentColor"><path d="M3 4c-.55 0-1 .45-1 1v14c0 .55.45 1 1 1s1-.45 1-1V5c0-.55-.45-1-1-1zm5.71 7.29l3.59-3.59a.996.996 0 1 1 1.41 1.41L11.41 11H20c.55 0 1 .45 1 1s-.45 1-1 1h-8.59l2.3 2.29a.996.996 0 1 1-1.41 1.41l-3.59-3.59a.996.996 0 0 1 0-1.42z"/></svg>';
        btn.addEventListener('click', function(e) {
          e.stopPropagation();
          e.preventDefault();
          if (state.isDocked || player.classList.contains('aplayer-docked-left') || player.classList.contains('aplayer-docked-right')) {
            undockPlayer();
          } else {
            var r = player.getBoundingClientRect();
            var side = (r.left + r.width / 2 > window.innerWidth / 2) ? 'right' : 'left';
            dockPlayer(side, r.top);
          }
        });
        timeWrap.appendChild(btn);
      }
    }
    injectDockButton();

    // Ensure clicking album pic anywhere reliably toggles playback
    if (pic) {
      pic.addEventListener('click', function(e) {
        var ap = getAPlayerInstance(player);
        if (state.isDocked || player.classList.contains('aplayer-docked-left') || player.classList.contains('aplayer-docked-right')) {
          // If docked and user clicks pic, undock & resume playback
          e.stopPropagation();
          e.preventDefault();
          undockPlayer();
          if (ap && ap.paused) {
            ap.play();
          }
          return;
        }

        // When expanded, if not directly clicking button element, trigger toggle
        if (!e.target.closest('.aplayer-button')) {
          if (ap) {
            ap.toggle();
          }
        }
      });
    }

    // --- Unified 2D Free Dragging & Edge Dragging Engine ---
    var drag = {
      active: false,
      hasMoved: false,
      startX: 0,
      startY: 0,
      elemX: 0,
      elemY: 0,
      pointerId: null,
      wasDocked: false,
      dockSide: 'left'
    };

    function isInteractiveTarget(target) {
      return Boolean(target.closest('button, .aplayer-icon, .aplayer-bar-wrap, .aplayer-volume-bar-wrap, ol, li, a, input'));
    }

    if (body) {
      body.addEventListener('pointerdown', function(e) {
        if (isInteractiveTarget(e.target)) return;

        drag.active = true;
        drag.hasMoved = false;
        drag.startX = e.clientX;
        drag.startY = e.clientY;
        drag.pointerId = e.pointerId;
        drag.wasDocked = state.isDocked || player.classList.contains('aplayer-docked-left') || player.classList.contains('aplayer-docked-right');
        drag.dockSide = state.dockSide || (player.classList.contains('aplayer-docked-right') ? 'right' : 'left');

        var rect = player.getBoundingClientRect();
        drag.elemX = rect.left;
        drag.elemY = rect.top;

        try {
          body.setPointerCapture(e.pointerId);
        } catch (err) {}
      });

      body.addEventListener('pointermove', function(e) {
        if (!drag.active || e.pointerId !== drag.pointerId) return;

        var dx = e.clientX - drag.startX;
        var dy = e.clientY - drag.startY;

        if (!drag.hasMoved && (Math.abs(dx) > 4 || Math.abs(dy) > 4)) {
          drag.hasMoved = true;
        }

        if (drag.hasMoved) {
          var vw = window.innerWidth;
          var vh = window.innerHeight;

          if (drag.wasDocked) {
            // Check if user is dragging outward away from edge to break out of dock
            var breakOutDistance = (drag.dockSide === 'left') ? dx : -dx;
            if (breakOutDistance > 45) {
              // Transition from docked to freely floating undocked drag
              drag.wasDocked = false;
              state.isDocked = false;
              player.classList.remove('aplayer-docked-left', 'aplayer-docked-right');
              player.classList.add('aplayer-dragging', 'aplayer-custom-pos');
              
              var w = 440;
              var curX = (drag.dockSide === 'left') ? Math.max(0, e.clientX - 30) : Math.min(vw - w, e.clientX - w + 30);
              var curY = Math.max(0, Math.min(vh - 66, e.clientY - 33));
              drag.elemX = curX;
              drag.elemY = curY;
              drag.startX = e.clientX;
              drag.startY = e.clientY;

              player.style.setProperty('left', curX + 'px', 'important');
              player.style.setProperty('top', curY + 'px', 'important');
              player.style.setProperty('bottom', 'auto', 'important');
              player.style.setProperty('right', 'auto', 'important');
            } else {
              // Drag up and down along the edge
              var newDockY = Math.max(10, Math.min(vh - 66, drag.elemY + dy));
              player.style.setProperty('top', newDockY + 'px', 'important');
              player.style.setProperty('bottom', 'auto', 'important');
            }
          } else {
            // Normal free 2D floating dragging
            player.classList.add('aplayer-dragging', 'aplayer-custom-pos');
            var w = player.offsetWidth || 440;
            var h = player.offsetHeight || 66;

            var newX = Math.max(0, Math.min(vw - w, drag.elemX + dx));
            var newY = Math.max(0, Math.min(vh - h, drag.elemY + dy));

            player.style.setProperty('left', newX + 'px', 'important');
            player.style.setProperty('top', newY + 'px', 'important');
            player.style.setProperty('bottom', 'auto', 'important');
            player.style.setProperty('right', 'auto', 'important');
          }
        }
      });

      var handlePointerEnd = function(e) {
        if (!drag.active || e.pointerId !== drag.pointerId) return;
        drag.active = false;
        player.classList.remove('aplayer-dragging');

        try {
          body.releasePointerCapture(e.pointerId);
        } catch (err) {}

        if (!drag.hasMoved) {
          // Pure click/tap without moving
          if (drag.wasDocked) {
            undockPlayer();
          }
          return;
        }

        var rect = player.getBoundingClientRect();
        var vw = window.innerWidth;
        var vh = window.innerHeight;
        // Strict edge contact snapping: only snap if player is physically pushed against the edge (<= 8px)
        var snapThreshold = 8;

        if (drag.wasDocked) {
          // Save new Y position on the edge
          dockPlayer(drag.dockSide, rect.top);
        } else {
          // Snapping check for free float: only snap when truly flush with the edge
          if (rect.left <= snapThreshold) {
            dockPlayer('left', rect.top);
          } else if (rect.right >= vw - snapThreshold) {
            dockPlayer('right', rect.top);
          } else {
            state.posX = rect.left;
            state.posY = rect.top;
            state.isDocked = false;
            player.classList.add('aplayer-custom-pos');
            try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (err2) {}
          }
        }
      };

      body.addEventListener('pointerup', handlePointerEnd);
      body.addEventListener('pointercancel', handlePointerEnd);
    }

    // --- 2D Free Dragging Engine for Floating Lyrics Capsule HUD ---
    var enableLyricsHud = player.dataset.lyricsHud !== 'false' && player.dataset.lyricshud !== 'false';
    if (lrc && enableLyricsHud) {
      var lrcDrag = {
        active: false,
        hasMoved: false,
        startX: 0,
        startY: 0,
        elemX: 0,
        elemY: 0,
        pointerId: null
      };

      lrc.addEventListener('pointerdown', function(e) {
        lrcDrag.active = true;
        lrcDrag.hasMoved = false;
        lrcDrag.startX = e.clientX;
        lrcDrag.startY = e.clientY;
        lrcDrag.pointerId = e.pointerId;

        var rect = lrc.getBoundingClientRect();
        lrcDrag.elemX = rect.left;
        lrcDrag.elemY = rect.top;

        try {
          lrc.setPointerCapture(e.pointerId);
        } catch (err) {}
      });

      lrc.addEventListener('pointermove', function(e) {
        if (!lrcDrag.active || e.pointerId !== lrcDrag.pointerId) return;

        var dx = e.clientX - lrcDrag.startX;
        var dy = e.clientY - lrcDrag.startY;

        if (!lrcDrag.hasMoved && (Math.abs(dx) > 3 || Math.abs(dy) > 3)) {
          lrcDrag.hasMoved = true;
          lrc.classList.add('aplayer-lrc-dragging', 'aplayer-lrc-custom-pos');
        }

        if (lrcDrag.hasMoved) {
          var vw = window.innerWidth;
          var vh = window.innerHeight;
          var w = lrc.offsetWidth || 260;
          var h = lrc.offsetHeight || 38;

          var newX = Math.max(8, Math.min(vw - w - 8, lrcDrag.elemX + dx));
          var newY = Math.max(8, Math.min(vh - h - 8, lrcDrag.elemY + dy));

          lrc.style.setProperty('left', newX + 'px', 'important');
          lrc.style.setProperty('top', newY + 'px', 'important');
          lrc.style.setProperty('bottom', 'auto', 'important');
          lrc.style.setProperty('right', 'auto', 'important');
          lrc.style.setProperty('transform', 'none', 'important');
        }
      });

      var handleLrcEnd = function(e) {
        if (!lrcDrag.active || e.pointerId !== lrcDrag.pointerId) return;
        lrcDrag.active = false;
        lrc.classList.remove('aplayer-lrc-dragging');

        try {
          lrc.releasePointerCapture(e.pointerId);
        } catch (err) {}

        if (lrcDrag.hasMoved) {
          lrc.classList.add('aplayer-lrc-custom-pos');
        }
      };

      lrc.addEventListener('pointerup', handleLrcEnd);
      lrc.addEventListener('pointercancel', handleLrcEnd);
    }
  }

  // --- Meting Fast-Cache & Acceleration Engine ---
  var METING_CACHE_PREFIX = 'meting_cache_v2_';
  var CACHE_EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 hours

  function hashStr(s) {
    var h = 0;
    for (var i = 0; i < s.length; i++) {
      h = ((h << 5) - h) + s.charCodeAt(i);
      h |= 0;
    }
    return Math.abs(h).toString(36);
  }

  function safeSetCache(key, val) {
    try {
      localStorage.setItem(key, JSON.stringify(val));
    } catch (err) {
      // Quota exceeded: clean up older meting caches
      try {
        for (var i = localStorage.length - 1; i >= 0; i--) {
          var k = localStorage.key(i);
          if (k && k.indexOf('meting_cache_') === 0) {
            localStorage.removeItem(k);
          }
        }
        localStorage.setItem(key, JSON.stringify(val));
      } catch (e2) {}
    }
  }

  function loadMetingFast() {
    if (typeof window.APlayer === 'undefined') return;
    var elements = document.querySelectorAll('.aplayer[data-id]');
    if (!elements || !elements.length) return;

    for (var i = 0; i < elements.length; i++) {
      var el = elements[i];
      if (el._metingLoaded) continue;

      var server = el.dataset.server || 'netease';
      var type = el.dataset.type || 'playlist';
      var id = el.dataset.id;
      if (!id) continue;

      var defaultApi = 'https://api.injahow.cn/meting/?server=:server&type=:type&id=:id&r=:r';
      if (typeof window.meting_api !== 'undefined' && window.meting_api) {
        defaultApi = window.meting_api;
      }
      var apiUrl = el.dataset.api || defaultApi;
      apiUrl = apiUrl.replace(':server', server)
                     .replace(':type', type)
                     .replace(':id', id)
                     .replace(':auth', el.dataset.auth || '')
                     .replace(':r', '');

      var useCache = el.dataset.cache !== 'false';
      var cacheKey = METING_CACHE_PREFIX + server + '_' + type + '_' + id + '_' + hashStr(apiUrl);
      var cached = null;

      if (useCache) {
        try {
          var item = localStorage.getItem(cacheKey);
          if (item) {
            var parsed = JSON.parse(item);
            if (parsed && parsed.data && (Date.now() - (parsed.time || 0) < CACHE_EXPIRY_MS)) {
              cached = parsed.data;
            }
          }
        } catch (e) {}
      }

      var initPlayer = function(targetEl, audioList) {
        if (!audioList || !audioList.length || targetEl._metingLoaded) return;
        targetEl._metingLoaded = true;

        var opt = {
          container: targetEl,
          audio: audioList,
          mini: targetEl.dataset.mini === 'true',
          fixed: targetEl.dataset.fixed !== 'false',
          autoplay: targetEl.dataset.autoplay === 'true',
          mutex: targetEl.dataset.mutex !== 'false',
          lrcType: parseInt(targetEl.dataset.lrctype, 10) || (audioList[0] && audioList[0].lrc ? 3 : 0),
          listFolded: targetEl.dataset.listfolded !== 'false',
          preload: targetEl.dataset.preload || 'auto',
          theme: targetEl.dataset.theme || '#6d8cff',
          loop: targetEl.dataset.loop || 'all',
          order: targetEl.dataset.order || 'list',
          volume: parseFloat(targetEl.dataset.volume) || 0.7,
          listMaxHeight: targetEl.dataset.listmaxheight || '240px',
          storageName: targetEl.dataset.storagename || 'metingjs'
        };

        window.aplayers = window.aplayers || [];
        var ap = new window.APlayer(opt);
        window.aplayers.push(ap);
        targetEl._aplayer = ap;

        initPlayerDock();
      };

      if (cached && Array.isArray(cached) && cached.length) {
        // Immediate instant rendering from cache!
        initPlayer(el, cached);
      }

      // Background / Initial fetch
      (function(targetEl, url, key, allowCache) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.onload = function() {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              var data = JSON.parse(xhr.responseText);
              if (Array.isArray(data) && data.length) {
                if (allowCache) {
                  safeSetCache(key, { time: Date.now(), data: data });
                }
                if (!targetEl._metingLoaded) {
                  initPlayer(targetEl, data);
                }
              }
            } catch (e3) {}
          }
        };
        xhr.send();
      })(el, apiUrl, cacheKey, useCache);
    }
  }

  function setup() {
    loadMetingFast();
    initPlayerDock();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setup);
  } else {
    setup();
  }

  window.addEventListener('load', function() {
    setTimeout(setup, 100);
    setTimeout(setup, 600);
  });

  document.addEventListener('pjax:complete', function() {
    setTimeout(setup, 100);
  });
})();
