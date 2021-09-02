FROM node:alpine as api_builder
WORKDIR /app/my-staging-directory

COPY . .

RUN npm install
RUN npm run build

FROM node:alpine
WORKDIR /app/my-awesome-app
COPY --from=api_builder /app/my-staging-directory/dist/ ./dist
COPY --from=api_builder /app/my-staging-directory/node_modules/ ./node_modules

CMD [ "node", "dist/index.js" ]