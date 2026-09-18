FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json ./
COPY backend/package.json backend/
COPY shared shared

RUN npm install --workspace=backend --omit=dev

COPY backend backend

WORKDIR /app/backend
RUN npm run build

ENV NODE_ENV=production
EXPOSE 5000
CMD ["npm", "start"]
