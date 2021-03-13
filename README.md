# Orderbook

Note: all instructions are using the `yarn` package manager. You can also use `npm`, if that's your thing.

## General

An Angular implementation of an order book using a websockets API.

## Setup

```shell
yarn install
```

## Run the local dev server

```shell
yarn start
```

visit http://localhost:4200

## Build

```shell
yarn build
```

For production builds:

```shell
yarn build:prod
```

## Tests

### Unit tests

```shell
yarn run test
```

Unit tests use jest

## Contributing

This project uses [prettier](https://github.com/prettier/prettier) and
[conventional commits](https://github.com/conventional-changelog/commitlint).
It is recommended to install the [husky](https://github.com/typicode/husky) pre-commit hook by running `yarn husky install`
