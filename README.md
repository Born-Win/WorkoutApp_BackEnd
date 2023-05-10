## Installation

```bash
$ npm install
```

## Presetting

```
# development
docker-compose -f ./build/docker/dc-dev.yml up

# outer development 
docker-compose -f ./build/docker/dc-dev-docker.yml up
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

```

## Test

```bash
# acceptance tests
$ npm run test:acceptance
```
