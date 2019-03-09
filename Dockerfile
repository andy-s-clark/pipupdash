# Need to use Chrome to get this working well
FROM ubuntu:18.04

RUN apt-get update \
    && apt-get install -y -q curl gnupg \
    && curl -sSL https://deb.nodesource.com/gpgkey/nodesource.gpg.key | apt-key add - \
    && echo "deb https://deb.nodesource.com/node_10.x/ bionic main" > /etc/apt/sources.list.d/nodesource.list \
    && curl -sSL https://dl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" > /etc/apt/sources.list.d/google-chrome.list \
    && apt-get update \
    && apt-get install -y -q nodejs google-chrome-stable \
    && apt-get clean \
    && useradd -m node \
    && mkdir /opt/app

WORKDIR /opt/app

COPY package*.json ./

RUN PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true npm install --production && rm -rf ~/.npm

COPY index.js ./

RUN chown -R node:node .

USER node

ENV HEADLESS true
ENV SLOWMO 0
ENV VIEWPORT_WIDTH 1920
ENV VIEWPORT_HEIGHT 1080
ENV REPEAT false
ENV SITES '[{"url":"https://http.cat/200"},{"url":"https://http.cat/201"}]'

CMD ["node", "index.js"]
