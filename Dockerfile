FROM node:10.15.3

RUN apt-get update \
    && apt-get install -y -q gconf-service libasound2 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 \
    libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 \
    libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 \
    libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 \
    ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget \
    # && apt-get install -y -q \
        chromium \
        libatk-bridge2.0 \
        libgtk-3-0 \
    && apt-get clean \
    && mkdir /opt/app

WORKDIR /opt/app

COPY package*.json ./

RUN npm install --production && rm -rf ~/.npm

COPY index.js ./

RUN chown -R node:node .

USER node

ENV HEADLESS true
ENV SLOWMO 0
ENV VIEWPORT_WIDTH 1920
ENV VIEWPORT_HEIGHT 1080
ENV REPEAT 0
ENV SITES '[{"url":"https://http.cat/200","wait":2000}]'

CMD ["node", "index.js"]
