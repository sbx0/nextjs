FROM node:lts

RUN apk add --no-cache libc6-compat

COPY ./ ./

RUN yarn install && npx next build

ENV NODE_ENV=production \
    PORT=3000

EXPOSE 3000

CMD [ "npx", "next", "start"]
