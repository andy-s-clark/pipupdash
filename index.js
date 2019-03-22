const puppeteer = require('puppeteer');
const AWS = require('aws-sdk');
const fs = require('fs')

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
      headless: 'HEADLESS' in process.env ? process.env['HEADLESS'] !== 'false' : true,
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

const doSites = async (sites, options, s3) => {
  const browser = await puppeteer.launch(options.browser);

  do {
    for (const site of sites) {
      await doSite(site, browser, options, s3);
    }
  } while (options.repeat);
  await browser.close();
  console.log('done');
};

const doSite = async (site, browser, options, s3) => {
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

  const screenshotBuffer = await page.screenshot({
    encoding: 'binary',
    type: 'png'
  });
  const uploadParams = { // TODO Move parameters to options
    Bucket: 'AWS_BUCKET' in process.env ? process.env['AWS_BUCKET'] :'my-bucket',
    Key: 'screenshot.png',
    Body: screenshotBuffer,
    ContentType: 'image/png',
    ACL: 'public-read'
  };
  s3.upload(uploadParams, (err, data) => {
    if (err) {
      console.log('Error', err);
    }
  });
  await page.close();
};

AWS.config.update({
  region: 'AWS_REGION' in process.env ? process.env['AWS_REGION'] : 'us-west-2'
});
const s3 = new AWS.S3({apiVersion: '2006-03-01'});

doSites(getSites(), getOptions(), s3);