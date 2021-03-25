# Kanban Board Demo

Simple Kanban Board made using React and Express.js

## Demo

https://kanban-board-demo.herokuapp.com/

## Local Installation.

- Run MongoDB
- Copy .env.example to .env
- Check DATABASE_URL credentials if required.
- Run `yarn` at root folder.
- Run `yarn` at `client/` folder.

To start both apps run `yarn start` at root and `client`

`http://localhost:3000` For client
`http://localhost:5000` For API

## Docker Compose

There is a docker-compose.yaml that runs MongoDB with the default required configuration.

Run `docker-compose up` to setup the MongoDB database.
