FROM node:20-alpine

WORKDIR /app

COPY . .

RUN npm install

ARG VITE_BACKEND_URL

RUN echo "VITE_BACKEND_URL=${VITE_BACKEND_URL}" > .env

RUN npm run build

EXPOSE 8081

CMD ["npm", "run", "preview"]