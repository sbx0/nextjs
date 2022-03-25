FROM node:16-alpine

RUN apk add --no-cache libc6-compat

COPY ./ ./

RUN yarn install
RUN npx next build

ENV NODE_ENV=production \
    NEXT_PUBLIC_API_URL="http://192.168.1.3:8080" \
    PORT=3000

EXPOSE 3000

CMD [ "npx", "next","start" ]
