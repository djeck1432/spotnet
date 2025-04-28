FROM node:23-slim

ENV PATH "/app/node_modules/.bin:$PATH"

WORKDIR /src

COPY ./package.json ./package-lock.json .

RUN npm install

COPY . .

CMD ["npm", "run", "dev", "--", "--host"]

EXPOSE 5173
