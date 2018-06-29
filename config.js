const yamlSafeLoad = require('js-yaml').safeLoad;
const readFileSync = require('fs').readFileSync;

exports.readConfig = (filepath) => {
  try {
    var config = yamlSafeLoad(readFileSync(filepath, 'utf-8'));
    return config;
  } catch (e) {
    console.log(e);
  }
}
