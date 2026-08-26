/**
 * New-Aplayer: Frosted Glass Draggable & Edge Docking Engine
 * Supports pointer/touch 2D free dragging, strict 8px edge contact snapping,
 * top-floating draggable lyrics HUD, Meting fast-cache, and state persistence.
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

  function injectDockButton(player) {
    var timeWrap = player.querySelector('.aplayer-time');
    if (!timeWrap) return;
    if (timeWrap.querySelector('.aplayer-icon-dock')) return;

    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'aplayer-icon aplayer-icon-dock';
    btn.title = '贴边收起/展开 (可自由拖拽吸附)';
    btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M3 4c-.55 0-1 .45-1 1v14c0 .55.45 1 1 1s1-.45 1-1V5c0-.55-.45-1-1-1zm5.71 7.29l3.59-3.59a.996.996 0 1 1 1.41 1.41L11.41 11H20c.55 0 1 .45 1 1s-.45 1-1 1h-8.59l2.3 2.29a.996.996 0 1 1-1.41 1.41l-3.59-3.59a.996.996 0 0 1 0-1.42z"/></svg>';
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

  function isInteractiveTarget(target) {
    return Boolean(target.closest('button, .aplayer-icon, .aplayer-bar-wrap, .aplayer-volume-bar-wrap, ol, li, a, input'));
  }

  function attachBodyDrag(player, body) {
    if (body.dataset.dockDragAttached === 'true') return;
    body.dataset.dockDragAttached = 'true';

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

    var onDown = function(clientX, clientY, pointerId, target) {
      if (isInteractiveTarget(target)) return false;

      drag.active = true;
      drag.hasMoved = false;
      drag.startX = clientX;
      drag.startY = clientY;
      drag.pointerId = pointerId;
      drag.wasDocked = state.isDocked || player.classList.contains('aplayer-docked-left') || player.classList.contains('aplayer-docked-right');
      drag.dockSide = state.dockSide || (player.classList.contains('aplayer-docked-right') ? 'right' : 'left');

      var rect = player.getBoundingClientRect();
      drag.elemX = rect.left;
      drag.elemY = rect.top;
      return true;
    };

    var onMove = function(clientX, clientY, pointerId) {
      if (!drag.active) return;
      if (pointerId !== null && drag.pointerId !== null && pointerId !== drag.pointerId) return;

      var dx = clientX - drag.startX;
      var dy = clientY - drag.startY;

      if (!drag.hasMoved && (Math.abs(dx) > 3 || Math.abs(dy) > 3)) {
        drag.hasMoved = true;
      }

      if (drag.hasMoved) {
        var vw = window.innerWidth;
        var vh = window.innerHeight;

        if (drag.wasDocked) {
          var breakOutDistance = (drag.dockSide === 'left') ? dx : -dx;
          if (breakOutDistance > 40) {
            drag.wasDocked = false;
            state.isDocked = false;
            player.classList.remove('aplayer-docked-left', 'aplayer-docked-right');
            player.classList.add('aplayer-dragging', 'aplayer-custom-pos');
            
            var w = Math.min(440, vw - 20);
            var curX = (drag.dockSide === 'left') ? Math.max(0, clientX - 30) : Math.min(vw - w, clientX - w + 30);
            var curY = Math.max(0, Math.min(vh - 66, clientY - 33));
            drag.elemX = curX;
            drag.elemY = curY;
            drag.startX = clientX;
            drag.startY = clientY;

            player.style.setProperty('left', curX + 'px', 'important');
            player.style.setProperty('top', curY + 'px', 'important');
            player.style.setProperty('bottom', 'auto', 'important');
            player.style.setProperty('right', 'auto', 'important');
          } else {
            var newDockY = Math.max(10, Math.min(vh - 66, drag.elemY + dy));
            player.style.setProperty('top', newDockY + 'px', 'important');
            player.style.setProperty('bottom', 'auto', 'important');
          }
        } else {
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
    };

    var onEnd = function(pointerId) {
      if (!drag.active) return;
      if (pointerId !== null && drag.pointerId !== null && pointerId !== drag.pointerId) return;
      drag.active = false;
      player.classList.remove('aplayer-dragging');

      if (!drag.hasMoved) {
        if (drag.wasDocked) {
          undockPlayer();
        }
        return;
      }

      var rect = player.getBoundingClientRect();
      var vw = window.innerWidth;
      var snapThreshold = 8;

      if (drag.wasDocked) {
        dockPlayer(drag.dockSide, rect.top);
      } else {
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

    // Standard Pointer Events
    body.addEventListener('pointerdown', function(e) {
      if (onDown(e.clientX, e.clientY, e.pointerId, e.target)) {
        try { body.setPointerCapture(e.pointerId); } catch (err) {}
      }
    });

    body.addEventListener('pointermove', function(e) {
      onMove(e.clientX, e.clientY, e.pointerId);
    });

    var handlePEnd = function(e) {
      try { body.releasePointerCapture(e.pointerId); } catch (err) {}
      onEnd(e.pointerId);
    };

    body.addEventListener('pointerup', handlePEnd);
    body.addEventListener('pointercancel', handlePEnd);

    // Touch Event Fallback for Mobile WebViews / Touch Browsers
    body.addEventListener('touchstart', function(e) {
      if (e.touches && e.touches.length === 1) {
        var t = e.touches[0];
        onDown(t.clientX, t.clientY, null, e.target);
      }
    }, { passive: true });

    body.addEventListener('touchmove', function(e) {
      if (drag.active && e.touches && e.touches.length === 1) {
        var t = e.touches[0];
        onMove(t.clientX, t.clientY, null);
        if (drag.hasMoved) {
          e.preventDefault();
        }
      }
    }, { passive: false });

    body.addEventListener('touchend', function() {
      onEnd(null);
    });
    body.addEventListener('touchcancel', function() {
      onEnd(null);
    });
  }

  function attachLrcDrag(lrc) {
    if (lrc.dataset.dockLrcDragAttached === 'true') return;
    lrc.dataset.dockLrcDragAttached = 'true';

    var lrcDrag = {
      active: false,
      hasMoved: false,
      startX: 0,
      startY: 0,
      elemX: 0,
      elemY: 0,
      pointerId: null
    };

    var onDown = function(clientX, clientY, pointerId) {
      lrcDrag.active = true;
      lrcDrag.hasMoved = false;
      lrcDrag.startX = clientX;
      lrcDrag.startY = clientY;
      lrcDrag.pointerId = pointerId;

      var rect = lrc.getBoundingClientRect();
      lrcDrag.elemX = rect.left;
      lrcDrag.elemY = rect.top;
      return true;
    };

    var onMove = function(clientX, clientY, pointerId) {
      if (!lrcDrag.active) return;
      if (pointerId !== null && lrcDrag.pointerId !== null && pointerId !== lrcDrag.pointerId) return;

      var dx = clientX - lrcDrag.startX;
      var dy = clientY - lrcDrag.startY;

      if (!lrcDrag.hasMoved && (Math.abs(dx) > 3 || Math.abs(dy) > 3)) {
        lrcDrag.hasMoved = true;
        lrc.classList.add('aplayer-lrc-dragging', 'aplayer-lrc-custom-pos');
      }

      if (lrcDrag.hasMoved) {
        var vw = window.innerWidth;
        var vh = window.innerHeight;
        var w = lrc.offsetWidth || 240;
        var h = lrc.offsetHeight || 38;

        var newX = Math.max(8, Math.min(vw - w - 8, lrcDrag.elemX + dx));
        var newY = Math.max(8, Math.min(vh - h - 8, lrcDrag.elemY + dy));

        lrc.style.setProperty('left', newX + 'px', 'important');
        lrc.style.setProperty('top', newY + 'px', 'important');
        lrc.style.setProperty('bottom', 'auto', 'important');
        lrc.style.setProperty('right', 'auto', 'important');
        lrc.style.setProperty('transform', 'none', 'important');
      }
    };

    var onEnd = function(pointerId) {
      if (!lrcDrag.active) return;
      if (pointerId !== null && lrcDrag.pointerId !== null && pointerId !== lrcDrag.pointerId) return;
      lrcDrag.active = false;
      lrc.classList.remove('aplayer-lrc-dragging');

      if (lrcDrag.hasMoved) {
        lrc.classList.add('aplayer-lrc-custom-pos');
      }
    };

    lrc.addEventListener('pointerdown', function(e) {
      if (onDown(e.clientX, e.clientY, e.pointerId)) {
        try { lrc.setPointerCapture(e.pointerId); } catch (err) {}
      }
    });

    lrc.addEventListener('pointermove', function(e) {
      onMove(e.clientX, e.clientY, e.pointerId);
    });

    var handleLrcPEnd = function(e) {
      try { lrc.releasePointerCapture(e.pointerId); } catch (err) {}
      onEnd(e.pointerId);
    };

    lrc.addEventListener('pointerup', handleLrcPEnd);
    lrc.addEventListener('pointercancel', handleLrcPEnd);

    // Touch events for lyrics capsule
    lrc.addEventListener('touchstart', function(e) {
      if (e.touches && e.touches.length === 1) {
        var t = e.touches[0];
        onDown(t.clientX, t.clientY, null);
      }
    }, { passive: true });

    lrc.addEventListener('touchmove', function(e) {
      if (lrcDrag.active && e.touches && e.touches.length === 1) {
        var t = e.touches[0];
        onMove(t.clientX, t.clientY, null);
        if (lrcDrag.hasMoved) {
          e.preventDefault();
        }
      }
    }, { passive: false });

    lrc.addEventListener('touchend', function() {
      onEnd(null);
    });
    lrc.addEventListener('touchcancel', function() {
      onEnd(null);
    });
  }

  function syncPlayerState() {
    var player = getPlayer();
    if (!player) return;

    var body = player.querySelector('.aplayer-body');
    if (!body) return;

    injectDockButton(player);
    attachBodyDrag(player, body);

    var lrc = document.querySelector('.aplayer.aplayer-fixed .aplayer-lrc');
    if (lrc) {
      attachLrcDrag(lrc);
    }

    var pic = player.querySelector('.aplayer-pic');
    if (pic && pic.dataset.dockPicAttached !== 'true') {
      pic.dataset.dockPicAttached = 'true';
      pic.addEventListener('click', function(e) {
        var ap = getAPlayerInstance(player);
        if (state.isDocked || player.classList.contains('aplayer-docked-left') || player.classList.contains('aplayer-docked-right')) {
          e.stopPropagation();
          e.preventDefault();
          undockPlayer();
          if (ap && ap.paused) {
            ap.play();
          }
          return;
        }
        if (!e.target.closest('.aplayer-button')) {
          if (ap) ap.toggle();
        }
      });
    }

    var apInstance = getAPlayerInstance(player);
    if (apInstance && apInstance._dockEventsHooked !== true) {
      apInstance._dockEventsHooked = true;
      apInstance.on('play', function() { player.classList.add('aplayer-playing'); });
      apInstance.on('pause', function() { player.classList.remove('aplayer-playing'); });
      if (!apInstance.paused) {
        player.classList.add('aplayer-playing');
      }
    }

    if (player.dataset.dockPosRestored !== 'true') {
      player.dataset.dockPosRestored = 'true';
      if (state.isDocked) {
        dockPlayer(state.dockSide, state.posY);
      } else if (state.posX !== null && state.posY !== null) {
        undockPlayer(state.posX, state.posY);
      }
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

        setTimeout(syncPlayerState, 50);
      };

      if (cached && Array.isArray(cached) && cached.length) {
        initPlayer(el, cached);
      }

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
    syncPlayerState();
  }

  var observer = new MutationObserver(function() {
    syncPlayerState();
  });
  if (document.body) {
    observer.observe(document.body, { childList: true, subtree: true });
  } else {
    document.addEventListener('DOMContentLoaded', function() {
      observer.observe(document.body, { childList: true, subtree: true });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setup);
  } else {
    setup();
  }

  window.addEventListener('load', function() {
    setTimeout(setup, 100);
    setTimeout(setup, 500);
    setTimeout(setup, 1200);
  });

  document.addEventListener('pjax:complete', function() {
    setTimeout(setup, 100);
    setTimeout(setup, 500);
  });
})();
