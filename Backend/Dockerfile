# Stage 1: Build
FROM node:20-alpine AS build

WORKDIR /usr/src/app

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml* ./

RUN pnpm install

COPY . .

RUN pnpm run build

# Stage 2: Run
FROM node:20-alpine

WORKDIR /usr/src/app

RUN npm install -g pnpm

COPY --from=build /usr/src/app .

EXPOSE 3000

CMD ["pnpm", "run", "start"]