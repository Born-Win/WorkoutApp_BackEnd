## Installation

```bash
$ npm install
```

## Presetting

```
# development for local usage
docker-compose -f ./build/docker/dc-dev-local.yml up

# development
docker-compose -f ./build/docker/dc-dev.yml up

# production mode
docker-compose -f ./build/docker/dc-prod.yml up
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
