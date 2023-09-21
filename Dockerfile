FROM node:alpine

WORKDIR /app

RUN npm i -g serve

CMD ["serve", "-s", "/app/build","-p","3000"]