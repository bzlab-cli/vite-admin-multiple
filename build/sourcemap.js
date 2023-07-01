const fs = require('fs')
const path = require('path')
const { run } = require('runjs')

run(`rimraf ${path.resolve(__dirname, '../dist/**/*.map')}`)

const regJs = /\/\/[#@]\s*sourceMappingURL\s*=\s*([^\s'"]+)/g
const regCss = /\/\*# sourceMappingURL\s*=\s*([^\s'"]+)/g

function removeSourceMappingURL(filePath, reg) {
  const fileContent = fs.readFileSync(filePath, 'utf-8')
  const modifiedContent = fileContent.replace(reg, '')
  fs.writeFileSync(filePath, modifiedContent, 'utf-8')
}

function removeSourceMappingURLFromDirectory(directoryPath, reg, suffix) {
  fs.readdirSync(directoryPath).forEach(file => {
    const filePath = path.join(directoryPath, file)
    const stat = fs.statSync(filePath)
    if (stat.isFile() && path.extname(file) === suffix) {
      removeSourceMappingURL(filePath, reg)
    }
  })
}

const targetDirectory = path.resolve(__dirname, '../dist/static/js')
const targetCssDirectory = path.resolve(__dirname, '../dist/static/css')

removeSourceMappingURLFromDirectory(targetDirectory, regJs, '.js')
removeSourceMappingURLFromDirectory(targetCssDirectory, regCss, '.css')
