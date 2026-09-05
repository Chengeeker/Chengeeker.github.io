import * as fs from 'hexo-fs'
import * as path from 'path'
import {BaseTag} from "./base"
import {PLAYER_TAG_OPTION, APLAYER_TAG_MARKER} from "../../common/constant"
import {throwError, extractOptionValue, escapeHtml} from "../../common/util"

export default class APlayerTag extends BaseTag {
    constructor(hexo, args, pid) {
      super(hexo, args, pid)
      this.settings = this.parse(args)
    }

    parse(options) {
        let settings = Object.assign({}, PLAYER_TAG_OPTION);
        ([settings.title, settings.author, settings.url] = options)
        const optionalArgs = options.slice(3)
        optionalArgs.forEach((value, index) => {
            switch(true) {
                case value === 'narrow' || value === 'narrow:true':
                    settings.narrow = true
                    break
                case value === 'narrow:false':
                    settings.narrow = false
                    break
                case value === 'autoplay' || value === 'autoplay:true':
                    settings.autoplay = true
                    break
                case value === 'autoplay:false':
                    settings.autoplay = false
                    break
                case /^lrc:/.test(value):
                    settings.lrcOption = 1
                    settings.lrcPath = extractOptionValue(value)
                    break
                case /^width:/.test(value):
                    settings.width = value + ';'
                    break
                case /^pic:/.test(value):
                    settings.pic = this.processUrl(extractOptionValue(value))
                    break
                case index === 0:
                    settings.pic = this.processUrl(value)
                    break
                default:
                    throwError(`Unrecognized tag argument(${index+1}): ${value}`)
            }
        })
        settings.width =  settings.narrow ? '' : settings.width
        return settings
    }

    generate() {
        const hexo = this.hexo
        let content = ''
        let {title, author, url, narrow, pic,
            autoplay, lrcOption, lrcPath, width} = this.settings
        if (lrcOption) {
          if (!/^https?/.test(lrcPath)) {
            const PostAsset = hexo.database._models.PostAsset
            const _path = path.join(hexo.base_dir, PostAsset.findOne({post: this.pid, slug: lrcPath})._id)
            content = fs.readFileSync(_path)
            lrcOption = 2
          } else {
            lrcOption = 3
          }
        }
        return `
        <div id="${this.id}" class="aplayer ${APLAYER_TAG_MARKER}" style="margin-bottom: 20px;${width}">
            <pre class="aplayer-lrc-content">${escapeHtml(content)}</pre>
        </div>
        <script>
          var ap = new APlayer({
            element: document.getElementById(${JSON.stringify(this.id)}),
            narrow: ${Boolean(narrow)},
            autoplay: ${Boolean(autoplay)},
            showlrc: ${lrcOption || 0},
            music: {
              title: ${JSON.stringify(title || '')},
              author: ${JSON.stringify(author || '')},
              url: ${JSON.stringify(url || '')},
              pic: ${JSON.stringify(pic || '')},
              lrc: ${JSON.stringify(lrcPath || '')}
            }
          });
          window.aplayers || (window.aplayers = []);
          window.aplayers.push(ap);
        </script>`
    }
}
