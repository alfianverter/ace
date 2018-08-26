/*
  update-changelog.js by Aceheliflyer
  This script automatically updates `CHANGELOG.md` based on `assets/changelog.json`.
*/
process.chdir(__dirname)
const changelog = require(`${process.cwd()}/../assets/changelog.json`)
const { stripIndents, oneLineTrim } = require('common-tags')
const moment = require('moment')
const fs = require('fs')
var repo = 'Aceheliflyer/AceBot'
var text = ''

var verbose = false
if (process.argv.includes('--verbose')) verbose = true

// Header text.
text += stripIndents`
  # Changelog
  All notable changes to this project will be documented in this file.

  The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0)
  and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

  > Last Updated ${moment(new Date()).format('YYYY/MM/DD HH:mm:SS')}

  ## [Unreleased]
`
text += '\n\n'

changelog.releases.forEach((release, index, object) => {
  if (verbose) { console.log(release.version) }
  // Changelog header.
  if (index === changelog.releases.length - 1) {
    text += `## ${release.version} - ${release.released}\n`
  } else {
    text += `## [${release.version}] - ${release.released}\n`
  }

  // Changelog footer.
  ['added', 'changed', 'deprecated', 'removed', 'fixed', 'security']
    .forEach(typeName => {
      if (release.types[typeName].length > 0) {
        var typeFix = typeName.charAt(0).toUpperCase() + typeName.slice(1)
        if (verbose) { console.log(`  ❯ ${typeFix}`) }
        text += `### ${typeFix}\n`
        release.types[typeName].sort()
        release.types[typeName].forEach(str => {
          if (verbose) { console.log(`    ❯ ${str}`) }
          text += `- ${str}\n`
        })
        text += '\n'
      }
    })
})

// Write version comparisons.
text += `[Unreleased]: http://github.com/${repo}/compare/v${changelog.releases[0].version}...HEAD\n`
changelog.releases.forEach((release, index, object) => {
  if (index === changelog.releases.length - 1) return
  text += `[${release.version}]: `
  text += oneLineTrim`http://github.com/${repo}/compare/
  v${changelog.releases[index + 1].version}...
  v${release.version}`
  text += '\n'
})
text += '\n'

// Footer text.
text += '---\n\n#### Generated by `bin/update-changelog.js`. 🚀'

// eol-last
text += '\n'

// Write to file.
fs.writeFile(`${process.cwd()}/../CHANGELOG.md`, text, (error) => {
  if (error) {
    console.error(error)
    process.exit(1)
  } else {
    process.exit(0)
  }
})
