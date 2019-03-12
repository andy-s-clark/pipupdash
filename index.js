const puppeteer = require('puppeteer');

const getSites = () => {
  if (!('SITES' in process.env)) {
    throw new Error('SITES is missing from the environment')
  }
  return JSON.parse(process.env['SITES']);
};

const getOptions = () => {
  return {
    browser: {
      args: [
        '--disable-setuid-sandbox',
        '--disable-gpu',
        '--no-sandbox'
      ],
      headless: 'HEADLESS' in process.env ? process.env['HEADLESS'] !== 'true' : true,
      slowMo: 'SLOWMO' in process.env ? parseInt(process.env['SLOWMO']) : 0,
      executablePath: '/usr/bin/google-chrome'
    },
    viewport: {
      width: 'VIEWPORT_WIDTH' in process.env ? parseInt(process.env['VIEWPORT_WIDTH']) : 1920,
      height: 'VIEWPORT_HEIGHT' in process.env ? parseInt(process.env['VIEWPORT_HEIGHT']) : 1080
    },
    repeat: 'REPEAT' in process.env && process.env['REPEAT'] === 'true'
  };
};

const doSites = async (sites, options) => {
  const browser = await puppeteer.launch(options.browser);

  do {
    for (const site of sites) {
      await doSite(site, browser, options);
    }
  } while (options.repeat);
  await browser.close();
  console.log('done');
};

const doSite = async (site, browser, options) => {
  const page = await browser.newPage();
  await page.setViewport(options.viewport);
  await page.goto(site['url']);
  if ('login' in site) { // LATER validate site options
    if ('usernameSelector' in site['login'] && 'username' in site['login']) {
      await page.$eval(site['login']['usernameSelector'], input => input.value = '');
      await page.type(site['login']['usernameSelector'], site['login']['username']);
    }
    if ('passwordSelector' in site['login'] && 'password' in site['login']) {
      await page.$eval(site['login']['passwordSelector'], input => input.value = '');
      await page.type(site['login']['passwordSelector'], site['login']['password'] + '\n');
    }
  }
  await page.waitFor('wait' in site ? parseInt(site['wait']) : 1000);
  await page.screenshot({path: 'example.png'});
  await page.close();
};

doSites(getSites(), getOptions());