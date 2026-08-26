'use strict'

const fs = require('fs')
const path = require('path')
const babel = require('babel-core')

function sourceFiles(directory) {
  return fs.readdirSync(directory, {withFileTypes: true}).flatMap(entry => {
    const filename = path.join(directory, entry.name)
    return entry.isDirectory() ? sourceFiles(filename) : filename.endsWith('.es') ? [filename] : []
  })
}

for (const filename of ['index.es', ...sourceFiles('common'), ...sourceFiles('lib')]) {
  const output = filename.replace(/\.es$/, '.js')
  fs.writeFileSync(output, babel.transformFileSync(filename, {presets: ['es2015']}).code)
}
