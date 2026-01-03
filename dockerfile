FROM node:25-alpine

WORKDIR /app

RUN npm install -g pnpm

COPY src *.json *.mts jest.config.ts ./

RUN pnpm i

EXPOSE 3120

CMD ["pnpm", "run", "dev"]