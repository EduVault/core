FROM node:12 AS build-stage
ENV PATH /eduvault/node_modules/.bin:/eduvault/api/node_modules/.bin:/eduvault/app/node_modules/.bin:$PATH

WORKDIR /eduvault/
COPY package*.json ./
RUN npm ci

WORKDIR /eduvault/api
COPY ./api/package*.json ./
RUN npm ci

WORKDIR /eduvault/app
COPY ./app/package*.json ./
RUN npm ci

WORKDIR /eduvault/
COPY . .

FROM build-stage AS prod-stage
ENV NODE_ENV=production
EXPOSE 5001

WORKDIR /eduvault/
RUN npm run build
CMD ["npm", "run", "start"]
