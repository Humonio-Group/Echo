FROM node:22-alpine

WORKDIR /app

COPY yarn.lock ./
COPY package.json ./
COPY tsconfig.json ./
RUN yarn install --production --frozen-lockfile

COPY prisma ./prisma/
RUN yarn db:generate

COPY . .

RUN yarn build

CMD yarn db:deploy && yarn db:seed && yarn start