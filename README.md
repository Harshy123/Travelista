# Hey Travelista

## Setup

Dependencies:

* Node.js (https://nodejs.org/en/)
  * The latest LTS should be fine.
* Yarn (https://yarnpkg.com/en/docs/install)

## Installation and start local dev

```
$ yarn install
$ yarn start
```

## Building standalone

```
$ yarn run build
```

## Prettier and Flow type checking

We are using flow for type checking; eslint & prettier for a consistent code
style.

Please run the following before making any commits

```
$ yarn run flow
$ yarn run lint
$ yarn run prettier-check
```

To auto-fix prettier errors, run

```
$ yarn run prettier-format
```

It is recommended to run prettier after every editor save so that you don't
have to do it manually everything. Refer to 
https://prettier.io/docs/en/editors.html for setup of different editor.


## Install new packages

After installing new packages, flow will require a module type for such packages.
An extra command needs to be run.

```
$ yarn install something-you-want --save
$ yarn run flow-typed-install
```
