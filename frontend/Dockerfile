FROM node:alpine
WORKDIR /frontend
COPY . /frontend
RUN rm -rf /frontend/node_modules /frontend/build
RUN npm install -g serve && \
    npm install && \
    chown node /frontend
EXPOSE 5000
CMD npm run build && serve -s build
USER node
