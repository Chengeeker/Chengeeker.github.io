if(!self.define){let e,i={};const d=(d,r)=>(d=new URL(d+".js",r).href,i[d]||new Promise((i=>{if("document"in self){const e=document.createElement("script");e.src=d,e.onload=i,document.head.appendChild(e)}else e=d,importScripts(d),i()})).then((()=>{let e=i[d];if(!e)throw new Error(`Module ${d} didn’t register its module`);return e})));self.define=(r,s)=>{const a=e||("document"in self?document.currentScript.src:"")||location.href;if(i[a])return;let c={};const n=e=>d(e,a),f={module:{uri:a},exports:c,require:n};i[a]=Promise.all(r.map((e=>f[e]||n(e)))).then((e=>(s(...e),c)))}}define(["./workbox-915e8d08"],(function(e){"use strict";self.addEventListener("message",(e=>{e.data&&"SKIP_WAITING"===e.data.type&&self.skipWaiting()})),e.precacheAndRoute([{url:"2024/12/05/clash/index.html",revision:"1b02e366a1a4da67ef7303924c84811f"},{url:"2024/12/05/Free to steal lessons/index.html",revision:"f93aab8dfd9a822cff4216651a7c6096"},{url:"2024/12/05/Fuck CNKI/index.html",revision:"ee42b93d08272f9ff87fcea7479f5504"},{url:"2024/12/05/hello-world/index.html",revision:"61b65bec0543e34c27d54ac51401b2e6"},{url:"2024/12/05/How to use lspatch/index.html",revision:"c93fb6c0fbbfeef95f9b670b7404955d"},{url:"2024/12/05/I am back/index.html",revision:"cf3c1c4b3aeb1e45acf1e20a2d8e8ab8"},{url:"2024/12/05/Ocean App/index.html",revision:"186efd48e1082dbdb4dd18d5ef30ba99"},{url:"2024/12/06/noRoot Xposed/index.html",revision:"2ee200e059bc8f67aa0d82406a7a131e"},{url:"2024/12/18/airport/index.html",revision:"ea90064d37809dba8e46d20854dc503a"},{url:"2025/01/05/fpa/index.html",revision:"1d1f9a9c9c58d975a3e3c8687a60fe89"},{url:"2025/01/05/mobile PC/index.html",revision:"07ed1e21197c441f541b75b4e344bb73"},{url:"2025/01/05/where are my documents/index.html",revision:"d9f4d63241c6cab63d37ced298ea71f3"},{url:"2025/01/06/how to use clash/index.html",revision:"1b13f3dea59e032f0854a5397f3cbdaa"},{url:"archives/2024/12/index.html",revision:"acb2a3558f6d45b7f2a984233f7e2b73"},{url:"archives/2024/index.html",revision:"965e3e0a7f4faee11426880db353ffd1"},{url:"archives/2025/01/index.html",revision:"6e1eca83503e35b771f4ac8f2cea046d"},{url:"archives/2025/index.html",revision:"2f04ede23cb2b5e47c55f9ec50f5841d"},{url:"archives/index.html",revision:"4c20f281e13014a8e08113d13d7fab9a"},{url:"archives/page/2/index.html",revision:"0f424e2d29573e51ec6cd709241bffd2"},{url:"assets/css/APlayer.min.css",revision:"fbe994054426fadb2dff69d824c5c67a"},{url:"assets/js/APlayer.min.js",revision:"8f1017e7a73737e631ff95fa51e4e7d7"},{url:"assets/js/Meting.min.js",revision:"bfac0368480fd344282ec018d28f173d"},{url:"categories/index.html",revision:"890b14d1bc547a37436d8ebfe16cd613"},{url:"categories/Software/index.html",revision:"c8b2a71bd28c3654944132b528f13344"},{url:"categories/Tutorials/index.html",revision:"e6f8c8f744896c036170cabdfc0cdcc6"},{url:"css/index.css",revision:"774eea6db414bbfd1328e77007fc0dd1"},{url:"css/var.css",revision:"d41d8cd98f00b204e9800998ecf8427e"},{url:"img/404.jpg",revision:"4ef3cfb882b6dd4128da4c8745e9a507"},{url:"img/butterfly-icon.png",revision:"28fa72a4d9b2feea4bb643a12facb7fb"},{url:"img/error-page.png",revision:"7ade9a88a5ced2c311e69b0b16680591"},{url:"img/friend_404.gif",revision:"68af0be9d22722e74665ef44dd532ba8"},{url:"index.html",revision:"8a05772302b92c606efc6f48c00ee900"},{url:"js/main.js",revision:"ab1dddd2229511c7cb6f2275f2f63e99"},{url:"js/search/algolia.js",revision:"75e66239aa7a33ad0218f92e08021a64"},{url:"js/search/local-search.js",revision:"3a22c1b24d57711a7c0566aa2cecf98e"},{url:"js/tw_cn.js",revision:"accbc2ce08ee93a7bc3bc2199f4d0cfd"},{url:"js/utils.js",revision:"8d3507831ac63b0d5fc9c22bc1e87957"},{url:"links/index.html",revision:"262a02a45d302529cbe88d5ee381ee72"},{url:"page/2/index.html",revision:"4c059d74c2dc4ad5ae402a7c4efa36b5"},{url:"shuoshuo/index.html",revision:"9f04a05b42d94254bfab2cd8b1ab8bcb"},{url:"tags/clash/index.html",revision:"e3e1d3c626b4587537c5b94b1865d666"},{url:"tags/index.html",revision:"4498f7e040ef4034f906981b41c9d908"},{url:"tags/Xposed/index.html",revision:"406b7f8c0a70ff44ed7c501426362342"},{url:"tags/抢课/index.html",revision:"0447914e46d2510a9d8436b8d82a0de6"},{url:"tags/知网/index.html",revision:"1055798b0877be5de388211d7c3e6666"}],{})}));
//# sourceMappingURL=service-worker.js.map
