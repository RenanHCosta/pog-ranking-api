FROM node:18

WORKDIR /app

COPY package.json /app

RUN yarn

COPY . /app

RUN npx prisma generate

EXPOSE 3333

ENV ADDRESS=0.0.0.0 PORT=3333

RUN yarn build

CMD ["yarn", "start"]