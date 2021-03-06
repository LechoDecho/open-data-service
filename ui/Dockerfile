#---------------------------------------------#
# First stage: image to build vue application #
#---------------------------------------------#
FROM node:14-alpine as builder

ARG UI_BASE_URL
ARG STORAGE_SERVICE_URL
ARG ADAPTER_SERVICE_URL
ARG PIPELINE_SERVICE_URL
ARG NOTIFICATION_SERVICE_URL
ARG SCHEMA_SERVICE_URL


WORKDIR /app

# Copy package*.json files first in order to make best use of docker layer caching
COPY package*.json ./

# npm clean slate install to get reproducible builds and quicker installs
RUN npm ci

# copy rest of the files
COPY ./src ./src
COPY ./public ./public
COPY ./*.js ./
COPY ./*.json ./

RUN echo "VUE_APP_BASE_URL=$UI_BASE_URL" > .env \
    && echo "VUE_APP_ADAPTER_SERVICE_URL=$ADAPTER_SERVICE_URL" >> .env \
    && echo "VUE_APP_STORAGE_SERVICE_URL=$STORAGE_SERVICE_URL" >> .env \
    && echo "VUE_APP_PIPELINE_SERVICE_URL=$PIPELINE_SERVICE_URL" >> .env \
    && echo "VUE_APP_NOTIFICATION_SERVICE_URL=$NOTIFICATION_SERVICE_URL" >> .env \
    && echo "VUE_APP_SCHEMA_SERVICE_URL=$SCHEMA_SERVICE_URL" >> .env \
    && cat .env

# lint project
RUN npm run lint-ci

# test project
RUN npm run test

# build vue.js production bundle to ./dist
RUN npm run build

#---------------------------------------------------------#
# Second stage: serve static html and js files with nginx #
#---------------------------------------------------------#
FROM nginx:1-alpine

# copy static result of builder to the standard nginx webroot
COPY --from=builder /app/dist /usr/share/nginx/html

# use custom nginx config
COPY default.conf /etc/nginx/conf.d/

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
