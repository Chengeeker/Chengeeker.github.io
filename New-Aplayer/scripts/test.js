'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');

console.log('🧪 Running New-Aplayer Unit Test Suite...\n');

// 1. Build Verification
console.log('1. Verifying build artifacts...');
const requiredFiles = [
  'index.js',
  'lib/config.js',
  'lib/view.js',
  'lib/tag/base.js',
  'lib/tag/player.js',
  'lib/tag/playerLyric.js',
  'lib/tag/playerList.js',
  'lib/tag/playerMeting.js',
  'common/constant.js',
  'common/util.js',
  'assets/APlayer.glass.css',
  'assets/APlayer.dock.js'
];

requiredFiles.forEach(f => {
  const p = path.join(__dirname, '..', f);
  assert.ok(fs.existsSync(p), `Missing required file: ${f}`);
});
console.log('   ✓ All required files and compiled JS exist.');

// Mock Hexo instance
const mockHexo = {
  config: {
    root: '/',
    aplayer: {
      meting: true,
      meting_api: 'https://api.injahow.cn/meting/'
    }
  },
  model: () => ({
    findOne: () => ({ path: 'test/path.mp3' })
  }),
  database: {
    _models: {
      PostAsset: {
        findOne: () => ({ _id: 'post_1/lyric.lrc' })
      }
    }
  },
  base_dir: process.cwd()
};

// 2. MetingTag Parser Tests
console.log('\n2. Testing MetingTag parser & argument flexibility...');
const MetingTag = require('../lib/tag/playerMeting').default;

// Test flexible boolean and keyword arguments
const meting1 = new MetingTag(mockHexo, ['13104322073', 'netease', 'playlist', 'listfolded:true', 'autoplay:false', 'fixed:true', 'mutex:true'], 'post1');
const out1 = meting1.generate();
assert.strictEqual(meting1.settings.listfolded, true, 'listfolded:true parsed incorrectly');
assert.strictEqual(meting1.settings.autoplay, false, 'autoplay:false parsed incorrectly');
assert.strictEqual(meting1.settings.fixed, true, 'fixed:true parsed incorrectly');
assert.strictEqual(meting1.settings.mutex, true, 'mutex:true parsed incorrectly');
assert.ok(out1.includes('data-listfolded="true"'), 'data-listfolded missing in markup');
assert.ok(out1.includes('data-autoplay="false"'), 'data-autoplay missing in markup');
console.log('   ✓ MetingTag handles listfolded:true, autoplay:false, fixed:true properly');

const meting2 = new MetingTag(mockHexo, ['13104322073', 'netease', 'playlist', 'list_folded:false', 'autoplay:true', 'mini'], 'post2');
assert.strictEqual(meting2.settings.listfolded, false, 'list_folded:false parsed incorrectly');
assert.strictEqual(meting2.settings.autoplay, true, 'autoplay:true parsed incorrectly');
assert.strictEqual(meting2.settings.mini, true, 'mini parsed incorrectly');
console.log('   ✓ MetingTag handles list_folded:false, autoplay:true, mini properly');

// 3. APlayerTag Parser & Safe Escaping Tests
console.log('\n3. Testing APlayerTag parser & safe JSON serialization...');
const APlayerTag = require('../lib/tag/player').default;

const ap1 = new APlayerTag(mockHexo, ['Title "With Quotes"', 'Author', 'https://example.com/song.mp3', 'autoplay:false', 'narrow:true'], 'post3');
const outAp1 = ap1.generate();
assert.strictEqual(ap1.settings.autoplay, false, 'autoplay:false parsed incorrectly in APlayerTag');
assert.strictEqual(ap1.settings.narrow, true, 'narrow:true parsed incorrectly in APlayerTag');
assert.ok(outAp1.includes('Title \\"With Quotes\\"'), 'Title quotes were not safely escaped');
console.log('   ✓ APlayerTag handles autoplay:false, narrow:true, and safe string serialization');

// 4. HTML Escape Utility Tests
console.log('\n4. Testing escapeHtml utility...');
const { escapeHtml } = require('../common/util');
assert.strictEqual(escapeHtml('<script>alert("XSS")</script>'), '&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;');
assert.strictEqual(escapeHtml('Normal text & "quotes"'), 'Normal text &amp; &quot;quotes&quot;');
assert.strictEqual(escapeHtml('[00:01.00] <hello> & "world"'), '[00:01.00] &lt;hello&gt; &amp; &quot;world&quot;');
console.log('   ✓ escapeHtml safely escapes HTML special characters');

// 5. Lyric & List Tag Tests
console.log('\n5. Testing APlayerLyricTag & APlayerListTag...');
const APlayerLyricTag = require('../lib/tag/playerLyric').default;
const APlayerListTag = require('../lib/tag/playerList').default;

const lyricTag = new APlayerLyricTag(mockHexo, ['Song', 'Artist', 'https://example.com/s.mp3'], 'post4', '[00:00.00]Test Lyric');
const outLyric = lyricTag.generate();
assert.ok(outLyric.includes('[00:00.00]Test Lyric'), 'Lyric content missing in output');
assert.ok(outLyric.includes('showlrc: 2'), 'showlrc option missing');

const listJson = JSON.stringify({
  music: [
    { title: 'Track 1', author: 'Artist 1', url: 'https://example.com/1.mp3', pic: 'https://example.com/1.jpg' }
  ]
});
const listTag = new APlayerListTag(mockHexo, listJson, 'post5');
const outList = listTag.generate();
assert.ok(outList.includes('Track 1'), 'Track 1 missing in list output');
console.log('   ✓ APlayerLyricTag and APlayerListTag render correctly');

// 6. PartialView DOM & Filter Tests
console.log('\n6. Testing PartialView injection & selective filtering...');
const PartialView = require('../lib/view').default;

const pageWithoutPlayer = new PartialView('<html><head><title>Test</title></head><body><p>No player here</p></body></html>', { path: 'post.html' });
assert.strictEqual(pageWithoutPlayer.isFullPage(), true, 'isFullPage failed');
assert.strictEqual(pageWithoutPlayer.hasHeadTag(), true, 'hasHeadTag failed');
assert.strictEqual(pageWithoutPlayer.hasTagMarker('hexo-tag-aplayer-mark'), false, 'False positive marker detection');

const pageWithPlayer = new PartialView('<html><head><title>Test</title></head><body><div class="aplayer hexo-tag-aplayer-mark"></div></body></html>', { path: 'music.html' });
assert.strictEqual(pageWithPlayer.hasTagMarker('hexo-tag-aplayer-mark'), true, 'Failed to detect player marker');

pageWithPlayer.injectAsset('<link rel="stylesheet" href="/test.css">');
assert.ok(pageWithPlayer.content.includes('<link rel="stylesheet" href="/test.css">\n</head>'), 'Asset injection failed');
console.log('   ✓ PartialView correctly discriminates player vs non-player pages');

console.log('\n🎉 All 6 test suites passed successfully (100% assertions satisfied)!\n');
