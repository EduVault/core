FROM node:12 AS build-stage
ENV PATH /eduvault/node_modules/.bin:$PATH

WORKDIR /eduvault/
COPY package*.json ./
RUN npm ci --production
RUN cd node_modules && ls ; cd .bin && ls

WORKDIR /eduvault/api
COPY ./api/package*.json ./
RUN npm ci

# WORKDIR /eduvault/app
# COPY ./app/package*.json ./
# RUN npm ci

WORKDIR /eduvault/
COPY . .

FROM build-stage AS prod-stage

WORKDIR /eduvault/
RUN npm run build:api
RUN npm i -D dotenv-cli
# build on system so docker does not run out of memory
# RUN npm run build:app
CMD ["npm", "run", "start"]
