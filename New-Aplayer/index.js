'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _hexoFs = require('hexo-fs');

var fs = _interopRequireWildcard(_hexoFs);

var _util = require('./common/util');

var _hexoUtil = require('hexo-util');

var util = _interopRequireWildcard(_hexoUtil);

var _constant = require('./common/constant');

var _playerMeting = require('./lib/tag/playerMeting');

var _playerMeting2 = _interopRequireDefault(_playerMeting);

var _player = require('./lib/tag/player');

var _player2 = _interopRequireDefault(_player);

var _playerLyric = require('./lib/tag/playerLyric');

var _playerLyric2 = _interopRequireDefault(_playerLyric);

var _playerList = require('./lib/tag/playerList');

var _playerList2 = _interopRequireDefault(_playerList);

var _view = require('./lib/view');

var _view2 = _interopRequireDefault(_view);

var _config = require('./lib/config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/**
* hexo-tag-aplayer
* https://github.com/grzhan/hexo-tag-aplayer
* Copyright (c) 2016, grzhan
* Licensed under the MIT license.
*
* Syntax:
*  {% aplayer title author url [picture_url, narrow, autoplay] %}
*/
require('babel-polyfill');

var hexoLog = require('hexo-log');
var log = typeof hexoLog === 'function' ? hexoLog({ name: 'hexo-tag-aplayer', debug: false }) : hexoLog.default || hexoLog.logger || console;
var config = new _config2.default(hexo);
var APLAYER_STYLE_LITERAL = '<link rel="stylesheet" class="' + _constant.APLAYER_SECONDARY_STYLE_MARKER + '" href="' + config.get('style') + '">';
var APLAYER_GLASS_STYLE_LITERAL = '<link rel="stylesheet" class="' + _constant.APLAYER_GLASS_STYLE_MARKER + '" href="' + config.get('glass_style') + '">';
var APLAYER_SCRIPT_LITERAL = '<script src="' + config.get('script') + '" class="' + _constant.APLAYER_SECONDARY_SCRIPT_MARKER + '"></script>';
var formatMetingApi = function formatMetingApi(api) {
  if (!api) return '';
  return api.includes(':server') ? api : api.replace(/\/?$/, '/') + '?server=:server&type=:type&id=:id&r=:r';
};

var METING_SCRIPT_LITERAL = config.get('meting_api') ? '<script>var meting_api=\'' + formatMetingApi(config.get('meting_api')) + '\'</script><script class="' + _constant.METING_SECONDARY_SCRIPT_MARKER + '" src="' + config.get('meting_script') + '"></script>' : '<script class="' + _constant.METING_SECONDARY_SCRIPT_MARKER + '" src="' + config.get('meting_script') + '"></script>';
var filterEmitted = { after_render: false, after_post_render: false };

config.get('assets').forEach(function (asset) {
  var _asset = _slicedToArray(asset, 4),
      external = _asset[0],
      name = _asset[1],
      dstPath = _asset[2],
      srcPath = _asset[3];

  if (!external && config.get('asset_inject') && fs.existsSync(srcPath)) {
    var genName = 'aplayer_asset_' + dstPath.replace(/[^a-zA-Z0-9_]/g, '_');
    hexo.extend.generator.register(genName, function () {
      return {
        path: dstPath,
        data: function data() {
          return fs.createReadStream(srcPath);
        }
      };
    });
  }
});

var globalPlayer = config.get('global');
var globalPlayerLiteral = globalPlayer && globalPlayer.enable !== false ? '<div class="aplayer no-destroy" data-id="' + (0, _util.escapeHtml)(globalPlayer.id || '') + '" data-server="' + (0, _util.escapeHtml)(globalPlayer.server || '') + '" data-type="' + (0, _util.escapeHtml)(globalPlayer.type || 'playlist') + '" data-fixed="' + (globalPlayer.fixed !== false) + '" data-autoplay="' + (globalPlayer.autoplay === true) + '" data-order="' + (0, _util.escapeHtml)(globalPlayer.order || 'list') + '" data-preload="' + (0, _util.escapeHtml)(globalPlayer.preload || 'auto') + '" data-mutex="' + (globalPlayer.mutex !== false) + '" data-listfolded="' + (globalPlayer.listfolded !== false && globalPlayer.list_folded !== false && globalPlayer.listFolded !== false) + '" data-theme="' + (0, _util.escapeHtml)(globalPlayer.theme || 'var(--aplayer-theme, #6d8cff)') + '"' + (globalPlayer.lrctype ? ' data-lrctype="' + (0, _util.escapeHtml)(globalPlayer.lrctype) + '"' : '') + (globalPlayer.volume ? ' data-volume="' + (0, _util.escapeHtml)(globalPlayer.volume) + '"' : '') + (globalPlayer.api ? ' data-api="' + (0, _util.escapeHtml)(formatMetingApi(globalPlayer.api)) + '"' : '') + '></div>' : '';

var hasPlayerMarkup = function hasPlayerMarkup(view) {
  return Boolean(globalPlayerLiteral) || view.hasTagMarker(_constant.APLAYER_TAG_MARKER) || view.hasTagMarker(_constant.METING_TAG_MARKER) || /<(?:meting-js|div)[^>]+(?:class=["'][^"']*aplayer|data-id=)/i.test(view.content);
};

hexo.extend.filter.register('after_render:html', function (raw, info) {
  filterEmitted.after_render = true;
  if (!config.get('asset_inject')) {
    return;
  }
  var view = new _view2.default(raw, info);
  if (view.isFullPage()) {
    if (!view.hasHeadTag()) {
      log.warn('[hexo-tag-aplayer]: <head> not found in ' + view.path + ', unable to inject script (like \'APlayer.js\') in this page.');
      return;
    }
    // Inject APlayer script
    if (hasPlayerMarkup(view) && !view.assetAlreadyInjected(_constant.APLAYER_SCRIPT_MARKER)) {
      view.injectAsset('<link rel="stylesheet" href="' + config.get('style') + '" class="' + _constant.APLAYER_STYLE_MARKER + '">');
      view.injectAsset('<link rel="stylesheet" href="' + config.get('glass_style') + '" class="' + _constant.APLAYER_GLASS_STYLE_MARKER + '">');
      view.injectAsset(util.htmlTag('script', { src: config.get('script'), class: _constant.APLAYER_SCRIPT_MARKER }, ''));
    }
    // Inject Meting script
    if (config.get('meting') && (Boolean(globalPlayerLiteral) || view.hasTagMarker(_constant.METING_TAG_MARKER) || /<meting-js\b|data-server=/i.test(view.content)) && !view.assetAlreadyInjected(_constant.METING_SCRIPT_MARKER)) {
      if (config.get('meting_api')) {
        view.injectAsset('<script>var meting_api=\'' + formatMetingApi(config.get('meting_api')) + '\'</script>');
      }
      view.injectAsset(util.htmlTag('script', { src: config.get('meting_script'), class: _constant.METING_SCRIPT_MARKER }, ''));
    }
    // Inject Docking & Drag Engine
    if (hasPlayerMarkup(view) && !view.assetAlreadyInjected(_constant.APLAYER_DOCK_SCRIPT_MARKER)) {
      view.injectAsset(util.htmlTag('script', { src: config.get('dock_script'), class: _constant.APLAYER_DOCK_SCRIPT_MARKER }, ''));
    }
    if (globalPlayerLiteral && !view.content.includes('aplayer-global-marker')) {
      view.content = view.content.replace('</body>', globalPlayerLiteral.replace('no-destroy', 'no-destroy aplayer-global-marker') + '\n</body>');
    }
    // Remove duplicate scripts
    view.removeLiteral(APLAYER_SCRIPT_LITERAL);
    view.removeLiteral(METING_SCRIPT_LITERAL);
    view.removeLiteral(APLAYER_STYLE_LITERAL);
  }
  return view.content;
});

hexo.extend.filter.register('after_post_render', function (data) {
  filterEmitted.after_post_render = true;
  if (!config.get('asset_inject')) {
    return data;
  }
  var hasTag = Boolean(globalPlayerLiteral) || data.content.includes(_constant.APLAYER_TAG_MARKER) || data.content.includes(_constant.METING_TAG_MARKER) || /<(?:meting-js|div)[^>]+(?:class=["'][^"']*aplayer|data-id=)/i.test(data.content);

  if (!hasTag) {
    return data;
  }

  // Polyfill: filter 'after_render:html' may not be fired in some cases, see https://github.com/hexojs/hexo-inject/issues/1
  if (config.get('meting')) {
    data.content = METING_SCRIPT_LITERAL + data.content;
  }
  data.content = APLAYER_GLASS_STYLE_LITERAL + APLAYER_STYLE_LITERAL + APLAYER_SCRIPT_LITERAL + data.content;
  return data;
});

hexo.extend.tag.register('aplayer', function (args) {
  try {
    var tag = new _player2.default(hexo, args, this._id);
    var output = tag.generate();
    return output;
  } catch (e) {
    console.error(e);
    return '\n\t\t\t<script>\n\t\t\t\tconsole.error("' + e + '");\n\t\t\t</script>';
  }
});

hexo.extend.tag.register('aplayerlrc', function (args, content) {
  try {
    var tag = new _playerLyric2.default(hexo, args, this._id, content);
    var output = tag.generate();
    return output;
  } catch (e) {
    console.error(e);
    return '\n\t\t\t<script>\n\t\t\t\tconsole.error("' + e + '");\n\t\t\t</script>';
  }
}, { ends: true });

hexo.extend.tag.register('aplayerlist', function (args, content) {
  try {
    var tag = new _playerList2.default(hexo, content, this._id);
    var output = tag.generate();
    return output;
  } catch (e) {
    console.error(e);
    return '\n\t\t\t<script>\n\t\t\t\tconsole.error("' + e + '");\n\t\t\t</script>';
  }
}, { ends: true });

hexo.extend.tag.register('meting', function (args) {
  try {
    if (!config.get('meting')) {
      (0, _util.throwError)('Meting support is disabled, cannot resolve the meting tags properly.');
    }
    var tag = new _playerMeting2.default(hexo, args, this._id);
    var output = tag.generate();
    return output;
  } catch (e) {
    console.error(e);
    return '\n\t\t\t<script>\n\t\t\t\tconsole.error("' + e + '");\n\t\t\t</script>';
  }
});

hexo.extend.tag.register('before_exit', function () {
  if (!filterEmitted.after_render && filterEmitted.after_post_render) {
    log.warn('Filter "after_render:html" not emitted during this generation, duplicate scripts would not be removed.');
  }
});