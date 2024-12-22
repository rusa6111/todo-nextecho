FROM node:20-alpine AS development

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install

COPY . .

CMD ["npm", "run", "dev"]

FROM  --platform=linux/x86_64 node:20-alpine AS production

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --production

COPY . .

RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]