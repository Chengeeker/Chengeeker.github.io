if(!self.define){let e,i={};const a=(a,s)=>(a=new URL(a+".js",s).href,i[a]||new Promise((i=>{if("document"in self){const e=document.createElement("script");e.src=a,e.onload=i,document.head.appendChild(e)}else e=a,importScripts(a),i()})).then((()=>{let e=i[a];if(!e)throw new Error(`Module ${a} didn’t register its module`);return e})));self.define=(s,r)=>{const d=e||("document"in self?document.currentScript.src:"")||location.href;if(i[d])return;let c={};const f=e=>a(e,d),b={module:{uri:d},exports:c,require:f};i[d]=Promise.all(s.map((e=>b[e]||f(e)))).then((e=>(r(...e),c)))}}define(["./workbox-915e8d08"],(function(e){"use strict";self.addEventListener("message",(e=>{e.data&&"SKIP_WAITING"===e.data.type&&self.skipWaiting()})),e.precacheAndRoute([{url:"2024/12/05/clash/index.html",revision:"470da21bef6741bc123414250a4698d6"},{url:"2024/12/05/Free to steal lessons/index.html",revision:"40dc2026f38b075ac14ec99f5a9089f6"},{url:"2024/12/05/Fuck CNKI/index.html",revision:"8821f076c2f32ce75d3ae3ec483a2d48"},{url:"2024/12/05/hello-world/index.html",revision:"6db6b0b423b916a281a6663d8649f13c"},{url:"2024/12/05/How to use lspatch/index.html",revision:"7001776123fd10c75fa0d492db9158e4"},{url:"2024/12/05/I am back/index.html",revision:"9a674de8a36544f080c401c2a5992833"},{url:"2024/12/05/Ocean App/index.html",revision:"f21ed29a7153a374bda0086070ded956"},{url:"2024/12/06/noRoot Xposed/index.html",revision:"ecfb358ea589a800b184f481c44c09cd"},{url:"2024/12/18/airport/index.html",revision:"afa60ad4c42a111cd492b74095f14d94"},{url:"2025/01/05/song/index.html",revision:"8acd1fd6a00f40d1da94f3f6f4b11e4d"},{url:"archives/2024/12/index.html",revision:"7cc35ed474ff5f2996f218bf3587d445"},{url:"archives/2024/index.html",revision:"9ff466779f0d6f641944a288f1932673"},{url:"archives/2025/01/index.html",revision:"4c87adff41125b4a7811f036f79b082e"},{url:"archives/2025/index.html",revision:"7a2f13ef13acb9bac51d43fc479643a8"},{url:"archives/index.html",revision:"73246f1b736d6a8e8e0914dcad17ec4e"},{url:"assets/css/APlayer.min.css",revision:"fbe994054426fadb2dff69d824c5c67a"},{url:"assets/js/APlayer.min.js",revision:"8f1017e7a73737e631ff95fa51e4e7d7"},{url:"assets/js/Meting.min.js",revision:"bfac0368480fd344282ec018d28f173d"},{url:"categories/index.html",revision:"82cfb1d130936bcdc1aa748ccdf6b954"},{url:"categories/Software/index.html",revision:"d1473174352a3d311a33d4470652e2dd"},{url:"categories/Tutorials/index.html",revision:"01ce517d4088ff62ba5dbac287f33a39"},{url:"css/index.css",revision:"753f2e01c57128a30c5cb7ee6358dfe4"},{url:"css/var.css",revision:"d41d8cd98f00b204e9800998ecf8427e"},{url:"images/morning.webp",revision:"0f02ed9ff4e706108585abdb8c033b36"},{url:"images/night.webp",revision:"be4bdf0e37cc00a583f35200bb9032ad"},{url:"images/photo/1.jpg",revision:"426bebfcdc8362fb27869ae55dee31ac"},{url:"images/photo/10.jpg",revision:"886bb525fa44505dab5e3403b63a87b0"},{url:"images/photo/11.jpg",revision:"00072f86e785b76d07eaecb115ae82e0"},{url:"images/photo/12.jpg",revision:"dd4eb7f2167ce7edded0a851dc34a0d8"},{url:"images/photo/2.jpg",revision:"73dc99218e1b03ed53a9b8c155bb7259"},{url:"images/photo/3.jpg",revision:"1f07f3376e971c19534731518c7a27c8"},{url:"images/photo/4.jpg",revision:"f32f91753c0f8ff8df8b54bf991abfad"},{url:"images/photo/5.jpg",revision:"ab4687ff23d5e589cc7b42ee9e59e4fd"},{url:"images/photo/6.jpg",revision:"2239b0a83532417686c4c4673d508217"},{url:"images/photo/7.jpg",revision:"c21c376f2ad9dc51f6a216d14ad98148"},{url:"images/photo/8.jpg",revision:"204a932b1ee158cf1e3dda3d41f0a12a"},{url:"images/photo/9.jpg",revision:"fd8f9941055661af9f4a1696b9e2410b"},{url:"images/photo/a.jpg",revision:"05f3ab153f5bd125d8796cbde4651c60"},{url:"images/qqchannel.webp",revision:"dcb93d8e2dbe3305b0b75eaf1e818c68"},{url:"images/touxiang.webp",revision:"64301548476f2f7ec6acccf22099698d"},{url:"images/touxiang2.png",revision:"4a14b2e9c72e08641b6d17ef423f4c4c"},{url:"images/web.webp",revision:"503aeaad1bb912f1d78b8491f4ffb055"},{url:"images/wechat.webp",revision:"c4acf998dd530f1f9505512bf6b19635"},{url:"images/works/tiktok.webp",revision:"5c8694b2c22239eba71b18d7c117e199"},{url:"images/works/Voov-Meeting.webp",revision:"fc789ca2c013c3814a0adebfdb21ddc1"},{url:"images/works/Xposed.webp",revision:"d54f8bf6acfa65dafbf4ef0f49c053cc"},{url:"images/works/抢课.webp",revision:"bfeb8380de91bbe41f838914e6802ef2"},{url:"images/works/抢课/抢课1.png",revision:"597c651dff4fc1c92efa7bbbc62c85c5"},{url:"images/works/抢课/抢课2.jpg",revision:"978b45e1ad7aa72cb93793b974939677"},{url:"images/works/抢课/抢课3.png",revision:"f580159f24db47f7e7c29272bfe5fe49"},{url:"images/works/抢课/抢课4.jpg",revision:"1031f2e5d25fb7b5a12012ad40977eec"},{url:"images/works/抢课/抢课5.jpg",revision:"0c25429ba868d07d81a66f516ea0a5aa"},{url:"images/works/抢课/抢课6.jpg",revision:"e586db2893076831c4ae6a583383a804"},{url:"images/works/抢课/抢课7.png",revision:"48a9e43dc13420f71a8f7a285c705e93"},{url:"images/works/植物大战僵尸.webp",revision:"90b33014098937e600fa4fabecbb574f"},{url:"images/works/知网.webp",revision:"01d821d1d9f48f30bd45bea12b917689"},{url:"images/works/翻墙.webp",revision:"e7c8c38bb94054ab92389280acbe1fdd"},{url:"img/404.jpg",revision:"4ef3cfb882b6dd4128da4c8745e9a507"},{url:"img/butterfly-icon.png",revision:"28fa72a4d9b2feea4bb643a12facb7fb"},{url:"img/error-page.png",revision:"7ade9a88a5ced2c311e69b0b16680591"},{url:"img/friend_404.gif",revision:"68af0be9d22722e74665ef44dd532ba8"},{url:"index.html",revision:"bc5198510dbcacfd89761d2a989b8ce6"},{url:"js/main.js",revision:"f93d9674fa0a266eefc65e92b21778be"},{url:"js/search/algolia.js",revision:"75e66239aa7a33ad0218f92e08021a64"},{url:"js/search/local-search.js",revision:"3a22c1b24d57711a7c0566aa2cecf98e"},{url:"js/tw_cn.js",revision:"accbc2ce08ee93a7bc3bc2199f4d0cfd"},{url:"js/utils.js",revision:"8d3507831ac63b0d5fc9c22bc1e87957"},{url:"links/index.html",revision:"8db5a5de0c1e84413b69be95b2a7987f"},{url:"masonry/index.html",revision:"a3c333a5bb02b5e9e0c5d6d997a1ebc7"},{url:"shuoshuo/index.html",revision:"ba8e7c41f38da9c1d6273fe847ed8f0c"},{url:"tags/clash/index.html",revision:"3c142b4e5fb9bca4c1954768842243f0"},{url:"tags/index.html",revision:"a803a52ce898b8c9b070b1e3842576d9"},{url:"tags/Xposed/index.html",revision:"d69e8057f0cb2a57d3b3c8569baa6911"},{url:"tags/抢课/index.html",revision:"dfe5eb650047271f6157f1f89b2cc550"},{url:"tags/知网/index.html",revision:"bf2cfecc39c14060fde9de968bff3d3f"}],{})}));
//# sourceMappingURL=service-worker.js.map
