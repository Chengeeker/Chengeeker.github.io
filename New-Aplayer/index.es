/**
* hexo-tag-aplayer
* https://github.com/grzhan/hexo-tag-aplayer
* Copyright (c) 2016, grzhan
* Licensed under the MIT license.
*
* Syntax:
*  {% aplayer title author url [picture_url, narrow, autoplay] %}
*/
require('babel-polyfill')

import * as fs from 'hexo-fs'
import {throwError, escapeHtml} from "./common/util"
import * as util from 'hexo-util'
import {
  APLAYER_SCRIPT_MARKER, APLAYER_TAG_MARKER, APLAYER_SECONDARY_SCRIPT_MARKER, APLAYER_DOCK_SCRIPT_MARKER,
  METING_TAG_MARKER, METING_SCRIPT_MARKER, METING_SECONDARY_SCRIPT_MARKER, APLAYER_SECONDARY_STYLE_MARKER,
  APLAYER_STYLE_MARKER, APLAYER_GLASS_STYLE_MARKER
} from './common/constant'
import MetingTag from "./lib/tag/playerMeting"
import APlayerTag from './lib/tag/player'
import APlayerLyricTag from './lib/tag/playerLyric'
import APlayerListTag from './lib/tag/playerList'
import PartialView from './lib/view'
import Config from './lib/config'

const hexoLog = require('hexo-log')
const log = typeof hexoLog === 'function'
  ? hexoLog({name: 'hexo-tag-aplayer', debug: false})
  : (hexoLog.default || hexoLog.logger || console)
const config = new Config(hexo)
const APLAYER_STYLE_LITERAL = `<link rel="stylesheet" class="${APLAYER_SECONDARY_STYLE_MARKER}" href="${config.get('style')}">`
const APLAYER_GLASS_STYLE_LITERAL = `<link rel="stylesheet" class="${APLAYER_GLASS_STYLE_MARKER}" href="${config.get('glass_style')}">`
const APLAYER_SCRIPT_LITERAL = `<script src="${config.get('script')}" class="${APLAYER_SECONDARY_SCRIPT_MARKER}"></script>`
const formatMetingApi = api => {
  if (!api) return ''
  return api.includes(':server') ? api : `${api.replace(/\/?$/, '/')}?server=:server&type=:type&id=:id&r=:r`
}

const METING_SCRIPT_LITERAL = config.get('meting_api')
  ? `<script>var meting_api='${formatMetingApi(config.get('meting_api'))}'</script><script class="${METING_SECONDARY_SCRIPT_MARKER}" src="${config.get('meting_script')}"></script>`
  : `<script class="${METING_SECONDARY_SCRIPT_MARKER}" src="${config.get('meting_script')}"></script>`
let filterEmitted = {after_render: false, after_post_render: false}


config.get('assets').forEach(asset => {
  const [external, name, dstPath, srcPath] = asset
  if (!external && config.get('asset_inject') && fs.existsSync(srcPath)) {
    const genName = `aplayer_asset_${dstPath.replace(/[^a-zA-Z0-9_]/g, '_')}`
    hexo.extend.generator.register(genName, () => {
      return {
        path: dstPath,
        data() {
          return fs.createReadStream(srcPath)
        }
      }
    })
  }
})

const globalPlayer = config.get('global')
const globalPlayerLiteral = (globalPlayer && globalPlayer.enable !== false)
  ? `<div class="aplayer no-destroy" data-id="${escapeHtml(globalPlayer.id || '')}" data-server="${escapeHtml(globalPlayer.server || '')}" data-type="${escapeHtml(globalPlayer.type || 'playlist')}" data-fixed="${globalPlayer.fixed !== false}" data-autoplay="${globalPlayer.autoplay === true}" data-order="${escapeHtml(globalPlayer.order || 'list')}" data-preload="${escapeHtml(globalPlayer.preload || 'auto')}" data-mutex="${globalPlayer.mutex !== false}" data-listfolded="${globalPlayer.listfolded !== false && globalPlayer.list_folded !== false && globalPlayer.listFolded !== false}" data-theme="${escapeHtml(globalPlayer.theme || 'var(--aplayer-theme, #6d8cff)')}"${globalPlayer.lrctype ? ` data-lrctype="${escapeHtml(globalPlayer.lrctype)}"` : ''}${globalPlayer.volume ? ` data-volume="${escapeHtml(globalPlayer.volume)}"` : ''}${globalPlayer.api ? ` data-api="${escapeHtml(formatMetingApi(globalPlayer.api))}"` : ''}></div>`
  : ''

const hasPlayerMarkup = view => Boolean(globalPlayerLiteral) || view.hasTagMarker(APLAYER_TAG_MARKER) || view.hasTagMarker(METING_TAG_MARKER) || /<(?:meting-js|div)[^>]+(?:class=["'][^"']*aplayer|data-id=)/i.test(view.content)

hexo.extend.filter.register('after_render:html', function(raw, info) {
  filterEmitted.after_render = true
  if (!config.get('asset_inject')) {
    return
  }
  const view = new PartialView(raw, info)
  if (view.isFullPage()) {
    if (!view.hasHeadTag()) {
      log.warn(`[hexo-tag-aplayer]: <head> not found in ${view.path}, unable to inject script (like 'APlayer.js') in this page.`)
      return
    }
    // Inject APlayer script
    if (hasPlayerMarkup(view) && !view.assetAlreadyInjected(APLAYER_SCRIPT_MARKER)) {
      view.injectAsset(`<link rel="stylesheet" href="${config.get('style')}" class="${APLAYER_STYLE_MARKER}">`)
      view.injectAsset(`<link rel="stylesheet" href="${config.get('glass_style')}" class="${APLAYER_GLASS_STYLE_MARKER}">`)
      view.injectAsset(util.htmlTag('script', {src: config.get('script'), class: APLAYER_SCRIPT_MARKER}, ''))

    }
    // Inject Meting script
    if (config.get('meting') && (Boolean(globalPlayerLiteral) || view.hasTagMarker(METING_TAG_MARKER) || /<meting-js\b|data-server=/i.test(view.content)) && !view.assetAlreadyInjected(METING_SCRIPT_MARKER)) {
      if (config.get('meting_api')) {
        view.injectAsset( `<script>var meting_api='${formatMetingApi(config.get('meting_api'))}'</script>`)
      }
      view.injectAsset(util.htmlTag('script', {src: config.get('meting_script'), class: METING_SCRIPT_MARKER}, ''))
    }
    // Inject Docking & Drag Engine
    if (hasPlayerMarkup(view) && !view.assetAlreadyInjected(APLAYER_DOCK_SCRIPT_MARKER)) {
      view.injectAsset(util.htmlTag('script', {src: config.get('dock_script'), class: APLAYER_DOCK_SCRIPT_MARKER}, ''))
    }
    if (globalPlayerLiteral && !view.content.includes('aplayer-global-marker')) {
      view.content = view.content.replace('</body>', `${globalPlayerLiteral.replace('no-destroy', 'no-destroy aplayer-global-marker')}\n</body>`)
    }
    // Remove duplicate scripts
    view.removeLiteral(APLAYER_SCRIPT_LITERAL)
    view.removeLiteral(METING_SCRIPT_LITERAL)
    view.removeLiteral(APLAYER_STYLE_LITERAL)
  }
  return view.content
})

hexo.extend.filter.register('after_post_render', (data) => {
  filterEmitted.after_post_render = true
  if (!config.get('asset_inject')) {
    return data
  }
  const hasTag = Boolean(globalPlayerLiteral) ||
    data.content.includes(APLAYER_TAG_MARKER) ||
    data.content.includes(METING_TAG_MARKER) ||
    /<(?:meting-js|div)[^>]+(?:class=["'][^"']*aplayer|data-id=)/i.test(data.content)

  if (!hasTag) {
    return data
  }

  // Polyfill: filter 'after_render:html' may not be fired in some cases, see https://github.com/hexojs/hexo-inject/issues/1
  if (config.get('meting')) {
    data.content = METING_SCRIPT_LITERAL + data.content
  }
  data.content = APLAYER_GLASS_STYLE_LITERAL + APLAYER_STYLE_LITERAL + APLAYER_SCRIPT_LITERAL + data.content
  return data
})

hexo.extend.tag.register('aplayer', function(args) {
  try {
    const tag = new APlayerTag(hexo, args, this._id)
    const output =  tag.generate()
    return output
  } catch (e) {
    console.error(e);
    return  `
			<script>
				console.error("${e}");
			</script>`;
  }
})

hexo.extend.tag.register('aplayerlrc', function(args, content) {
  try {
    const tag = new APlayerLyricTag(hexo, args, this._id, content)
    const output =  tag.generate()
    return output
  } catch (e) {
    console.error(e);
    return  `
			<script>
				console.error("${e}");
			</script>`
  }
}, {ends: true})


hexo.extend.tag.register('aplayerlist', function(args, content) {
  try {
    const tag = new APlayerListTag(hexo, content, this._id)
    const output =  tag.generate()
    return output
  } catch (e) {
    console.error(e)
    return  `
			<script>
				console.error("${e}");
			</script>`
  }
}, {ends: true})


hexo.extend.tag.register('meting', function(args) {
  try {
    if (!config.get('meting')) {
      throwError('Meting support is disabled, cannot resolve the meting tags properly.')
    }
    const tag = new MetingTag(hexo, args, this._id)
    const output = tag.generate()
    return output
  } catch (e) {
    console.error(e)
    return `
			<script>
				console.error("${e}");
			</script>`
  }
})

hexo.extend.tag.register('before_exit', function() {
  if (!filterEmitted.after_render && filterEmitted.after_post_render) {
    log.warn('Filter "after_render:html" not emitted during this generation, duplicate scripts would not be removed.')
  }
})
