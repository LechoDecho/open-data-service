# First stage: image to build and test node application
FROM node:14-alpine as builder

WORKDIR /build

# Copy package*.json files first in order to make best use of docker layer caching
COPY ./package*.json ./

# npm clean slate install to get reproducible builds and quicker installs
RUN npm ci

# copy rest of the files
COPY ./tsconfig.json ./
COPY ./.eslintrc.js ./
COPY ./jest.config.js ./
COPY ./src ./src

# build and test
RUN npm run lint-ci
RUN npm run transpile
RUN npm run test

# Second stage: image to run node application
FROM node:14-alpine

RUN mkdir /app
WORKDIR /app

COPY --from=builder /build/dist/ ./dist/
COPY --from=builder /build/package*.json ./

RUN npm ci --only=production
EXPOSE 8080

CMD [ "npm", "run", "start:transpiled" ]
