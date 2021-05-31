# See here for image contents: https://github.com/microsoft/vscode-dev-containers/tree/v0.177.0/containers/typescript-node/.devcontainer/base.Dockerfile

# [Choice] Node.js version: 16, 14, 12
ARG VARIANT="16-buster"
FROM mcr.microsoft.com/vscode/devcontainers/javascript-node:0-${VARIANT}

RUN apt-key adv --refresh-keys --keyserver keyserver.ubuntu.com
# Temporary workaround due to yarn including carriage returns in their public key
# ADD https://dl.yarnpkg.com/debian/pubkey.gpg /etc/apt/trusted.gpg.d/yarn.asc
# RUN chmod +r /etc/apt/trusted.gpg.d/*.asc && \
#     sed -i 's/\r//' /etc/apt/trusted.gpg.d/yarn.asc && \
#    echo "deb http://dl.yarnpkg.com/debian/ stable main" > /etc/apt/sources.list.d/yarn.list 

# Install other OS packages 
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive && \
    apt-get -y install --no-install-recommends \
        apt-transport-https ca-certificates curl gnupg2 lsb-release \        
        # <more packages if needed>
        ####
        # Install Docker CE CLI
        && curl -fsSL https://download.docker.com/linux/$(lsb_release -is | tr '[:upper:]' '[:lower:]')/gpg | apt-key add - 2>/dev/null \
        && echo "deb [arch=amd64] https://download.docker.com/linux/$(lsb_release -is | tr '[:upper:]' '[:lower:]') $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list \
        && apt-get update \
        && apt-get install -y docker-ce-cli
        
# Install Docker Compose
RUN LATEST_COMPOSE_VERSION=$(curl -sSL "https://api.github.com/repos/docker/compose/releases/latest" | grep -o -P '(?<="tag_name": ").+(?=")') \
    && curl -sSL "https://github.com/docker/compose/releases/download/${LATEST_COMPOSE_VERSION}/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose \
    && chmod +x /usr/local/bin/docker-compose
    
# [Optional] Uncomment if you want to install an additional version of node using nvm
# ARG EXTRA_NODE_VERSION=10
# RUN su node -c "source /usr/local/share/nvm/nvm.sh && nvm install ${EXTRA_NODE_VERSION}"

# [Optional] Install more global node packages
RUN su node -c "npm install -g node-gyp@latest npm@latest" && \
    npm cache clean --force > /dev/null 2>&1

