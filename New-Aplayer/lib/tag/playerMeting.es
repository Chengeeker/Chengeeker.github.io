import {METING_TAG_OPTION, METING_TAG_MARKER, APLAYER_TAG_MARKER} from '../../common/constant'
import {throwError, extractOptionValue, escapeHtml} from '../../common/util'
import {BaseTag} from "./base"

export default class MetingTag extends BaseTag {
  constructor(hexo, args, pid) {
    super(hexo, args, pid)
    this.settings = this.parse(args)
  }

  parse(options) {
    let settings = Object.assign({}, METING_TAG_OPTION);
    ([settings.id, settings.server, settings.type] = options)
    const optionalArgs = options.slice(3)
    optionalArgs.forEach((option, index) => {
      switch (true) {
        case option === 'autoplay' || option === 'autoplay:true':
          settings.autoplay = true
          break
        case option === 'autoplay:false':
          settings.autoplay = false
          break
        case option === 'fixed' || option === 'fixed:true':
          settings.fixed = true
          break
        case option === 'fixed:false':
          settings.fixed = false
          break
        case option === 'mini' || option === 'mini:true':
          settings.mini = true
          break
        case option === 'mini:false':
          settings.mini = false
          break
        case option.startsWith('loop:'):
          settings.loop = extractOptionValue(option);
          break;
        case option.startsWith('order:'):
          settings.order = extractOptionValue(option);
          break;
        case option.startsWith('volume:'):
          settings.volume = extractOptionValue(option);
          break;
        case option.startsWith('lrctype:'):
          settings.lrctype = extractOptionValue(option);
          break;
        case option === 'listfolded' || option === 'listfolded:true' || option === 'list_folded' || option === 'list_folded:true':
          settings.listfolded = true;
          break;
        case option === 'listfolded:false' || option === 'list_folded:false':
          settings.listfolded = false;
          break;
        case option.startsWith('storagename:'):
          settings.storagename = extractOptionValue(option);
          break;
        case option === 'mutex' || option === 'mutex:true':
          settings.mutex = true
          break
        case option === 'mutex:false':
          settings.mutex = false
          break
        case option.startsWith('mode:'):
          settings.mode = extractOptionValue(option)
          break
        case option.startsWith('listmaxheight:'):
          settings.listmaxheight = extractOptionValue(option)
          break
        case option.startsWith('preload:'):
          settings.preload = extractOptionValue(option)
          break
        case option.startsWith('theme:'):
          settings.theme = extractOptionValue(option)
          break
        case option.startsWith('api:'):
          settings.api = extractOptionValue(option)
          break
        default:
          throwError(`Unrecognized tag argument(${index + 1}): ${option}`)
      }
    })
    return settings
  }

  generate() {
    let settingLiteral = ''
    Object.entries(this.settings).forEach(([key, value]) => {
      if (key === 'api') {
        const val = value.includes(':server') ? value : `${value.replace(/\/?$/, '/')}?server=:server&type=:type&id=:id&r=:r`
        settingLiteral += ` data-api="${escapeHtml(val)}"`
      } else {
        settingLiteral += ` data-${key}="${escapeHtml(value)}"`
      }
    })
    return `
    <div id="${this.id}" class="aplayer ${APLAYER_TAG_MARKER} ${METING_TAG_MARKER}"
        ${settingLiteral}
    ></div>`
  }
}
