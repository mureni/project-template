### Use Node 16 in Alpine as the base image 
FROM node:16-alpine AS base

### Accept incoming argument "INSTALL_DIR" from ./docker-compose.yml
ARG INSTALL_DIR
ENV INSTALL_DIR=${INSTALL_DIR}

### Install build toolchain, install node deps and compile native add-ons
RUN apk --no-cache add make g++ sudo curl jq wget

### Uncomment for node-canvas prerequisites
# RUN apk --no-cache add build-base libpng libpng-dev jpeg-dev pango-dev cairo-dev giflib-dev
### Uncomment for sqlite
# RUN apk --no-cache add sqlite

### Install python 
ENV PYTHONUNBUFFERED=1
RUN apk add --update --no-cache python3 && ln -sf python3 /usr/bin/python
RUN python3 -m ensurepip
RUN pip3 install --no-cache --upgrade pip setuptools

### Install certificates and glibc (for node-gyp) 
RUN apk --no-cache add ca-certificates && \
    wget -q -O /etc/apk/keys/sgerrand.rsa.pub https://alpine-pkgs.sgerrand.com/sgerrand.rsa.pub && \
    wget https://github.com/sgerrand/alpine-pkg-glibc/releases/download/2.32-r0/glibc-2.32-r0.apk && \
    apk add glibc-2.32-r0.apk

### Copy package.json to temp folder, install dependencies, and then copy them to the project folder
### This allows caching of dependencies instead of rebuilding them every time the container is loaded
COPY package.json /tmp/package.json
RUN cd /tmp && npm install 
RUN mkdir -p /opt/${INSTALL_DIR}/node_modules/ && chown -R node:node /opt/${INSTALL_DIR}/
RUN cp -a /tmp/node_modules /opt/${INSTALL_DIR}/

### Use 'base' image to cache initial/uncommon software installation 
FROM base as code
### USER is defined in ./.devcontainer/devcontainer.json and ./.devcontainer/Dockerfile (last line, RUN su -u node...)
USER node
### Set working directory
WORKDIR /opt/${INSTALL_DIR}/
### Copy files over as the user defined above
COPY --chown=node:node . /opt/${INSTALL_DIR}
### Compile the project
RUN ./node_modules/.bin/tsc


### Note: Starting the project is handled via ./docker-compose.yml