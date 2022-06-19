FROM node:16

RUN useradd --user-group --create-home --shell /bin/false bot

ENV HOME=/home/bot

COPY my.env package.json package-lock.json $HOME/emstat/
RUN chown -R bot:bot $HOME/*
RUN apt-get update || : && apt-get install python -y
USER bot
WORKDIR $HOME/emstat
RUN npm install

USER root
COPY . $HOME/emstat
RUN mkdir -p data
RUN chown -R bot:bot $HOME/*
USER bot