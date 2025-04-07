const fs = require('fs')
const pathToInputFile = '.builds/presentation/CompiledPresentationLayer.js'
const pathToOutputFile = '.builds/presentation/CompiledPresentationLayer.js'
const compiledPresentationLayerCode = fs.readFileSync(pathToInputFile, 'utf8')
const esModuleCode =
`
/* eslint-disable */
${compiledPresentationLayerCode}
export default PresentationLayer;
`

fs.writeFileSync(pathToOutputFile, esModuleCode, 'utf8');