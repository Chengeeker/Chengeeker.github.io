if(!self.define){let e,i={};const d=(d,a)=>(d=new URL(d+".js",a).href,i[d]||new Promise((i=>{if("document"in self){const e=document.createElement("script");e.src=d,e.onload=i,document.head.appendChild(e)}else e=d,importScripts(d),i()})).then((()=>{let e=i[d];if(!e)throw new Error(`Module ${d} didn’t register its module`);return e})));self.define=(a,r)=>{const s=e||("document"in self?document.currentScript.src:"")||location.href;if(i[s])return;let c={};const n=e=>d(e,s),l={module:{uri:s},exports:c,require:n};i[s]=Promise.all(a.map((e=>l[e]||n(e)))).then((e=>(r(...e),c)))}}define(["./workbox-915e8d08"],(function(e){"use strict";self.addEventListener("message",(e=>{e.data&&"SKIP_WAITING"===e.data.type&&self.skipWaiting()})),e.precacheAndRoute([{url:"2024/12/05/clash/index.html",revision:"cdba1202b9fcb0500825a8fcb5bd946f"},{url:"2024/12/05/Free to steal lessons/index.html",revision:"73361ea262f48e6afe48082a2b91e21b"},{url:"2024/12/05/Fuck CNKI/index.html",revision:"adad5055ed660b51a4ff1e50c352e58c"},{url:"2024/12/05/hello-world/index.html",revision:"de9be253c4444edad26f66f3529368ba"},{url:"2024/12/05/How to use lspatch/index.html",revision:"c78ace08ba11c78148c8df2b0f872070"},{url:"2024/12/05/I am back/index.html",revision:"ea9f6cc9debf1f9b19a885d1b9e6d600"},{url:"2024/12/05/Ocean App/index.html",revision:"80adbaaee13e2d2645e066e56963f3fd"},{url:"2024/12/06/noRoot Xposed/index.html",revision:"f713311e46280ec21d255835a0901250"},{url:"2024/12/18/airport/index.html",revision:"7e1c3d1664119047afa609f77638cd57"},{url:"2025/01/05/fpa/index.html",revision:"662d2bd71fb265fb0da8fec42a8a430c"},{url:"2025/01/05/mobile PC/index.html",revision:"72d70e1c70e30192922b8c342a10065d"},{url:"2025/01/05/where are my documents/index.html",revision:"53ef1fd02403fa89d8be570047aa116f"},{url:"2025/01/06/how to use clash/index.html",revision:"d9ca2e46a7306b8a8f0d3736984e3fe7"},{url:"archives/2024/12/index.html",revision:"9093d1db7675c9349c1dfb61487056f2"},{url:"archives/2024/index.html",revision:"f3a0815ce50bd594f2186d262174eb74"},{url:"archives/2025/01/index.html",revision:"7d5e178fe242a201e958d65a6804bdad"},{url:"archives/2025/index.html",revision:"bfda22e12f696db94dd5ed56e3d1728d"},{url:"archives/index.html",revision:"0cfd14ab06452616cf17f25eabb95338"},{url:"archives/page/2/index.html",revision:"014c32d2da2e1c67d09bd5afadaf9da7"},{url:"assets/css/APlayer.min.css",revision:"fbe994054426fadb2dff69d824c5c67a"},{url:"assets/js/APlayer.min.js",revision:"8f1017e7a73737e631ff95fa51e4e7d7"},{url:"assets/js/Meting.min.js",revision:"bfac0368480fd344282ec018d28f173d"},{url:"categories/index.html",revision:"031455600c4ae4a1c35d1f7ed2314d7d"},{url:"categories/Software/index.html",revision:"597c6e75daeea6a68df4a26dcd1250e0"},{url:"categories/Tutorials/index.html",revision:"237777a4434f88dfbf3b58ed231c71e6"},{url:"css/index.css",revision:"e09c2650064bc82fb5ba314beb816639"},{url:"css/var.css",revision:"d41d8cd98f00b204e9800998ecf8427e"},{url:"img/404.jpg",revision:"4ef3cfb882b6dd4128da4c8745e9a507"},{url:"img/butterfly-icon.png",revision:"28fa72a4d9b2feea4bb643a12facb7fb"},{url:"img/error-page.png",revision:"7ade9a88a5ced2c311e69b0b16680591"},{url:"img/friend_404.gif",revision:"68af0be9d22722e74665ef44dd532ba8"},{url:"index.html",revision:"04b1e89aee0252d9fa6af0cedf39d28b"},{url:"js/main.js",revision:"ab1dddd2229511c7cb6f2275f2f63e99"},{url:"js/search/algolia.js",revision:"75e66239aa7a33ad0218f92e08021a64"},{url:"js/search/local-search.js",revision:"3a22c1b24d57711a7c0566aa2cecf98e"},{url:"js/tw_cn.js",revision:"accbc2ce08ee93a7bc3bc2199f4d0cfd"},{url:"js/utils.js",revision:"8d3507831ac63b0d5fc9c22bc1e87957"},{url:"links/index.html",revision:"afc333951bc808ae950a21c620c4c2a5"},{url:"page/2/index.html",revision:"8670c21341b7242d99b6fbce3e907992"},{url:"shuoshuo/index.html",revision:"a0df248b018c6a3be6797b055d4cfbdb"},{url:"tags/clash/index.html",revision:"5bae9c09f703e9de825572a961a4cdb6"},{url:"tags/index.html",revision:"dbe3b0c076b2abc9b34439660e80a5d8"},{url:"tags/Xposed/index.html",revision:"68a87868753a661649adf82849c2ce2a"},{url:"tags/抢课/index.html",revision:"6358332bd68d907db2e390a4d0f8d103"},{url:"tags/知网/index.html",revision:"c48327625a3cb59fef8d33b9c667bdea"}],{})}));
//# sourceMappingURL=service-worker.js.map
