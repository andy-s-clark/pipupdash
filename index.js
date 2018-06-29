const configFilepath = './config.yaml';
const config = require('./config').readConfig(configFilepath);

Object.keys(config.pages).forEach((key) => {
  console.log(key);
  console.log(config.pages[key]);
});
