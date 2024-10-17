FROM node:20

WORKDIR /app

RUN npm install -g pnpm

COPY package* .
COPY ./prisma .

RUN pnpm install
RUN DATABASE_URL=$DATABASE_URL npx prisma generate

COPY . .

RUN pnpm run build

EXPOSE 8000

CMD ["node", "dist/index.js"]
