<div align="center">
  <img height="150" src="https://ialopezg.com/packages/corejs/corejs-logo.png" alt="CoreJS Logo" />
</div>

<div align="center">
  <strong>Custom tools for NodeJS</strong> :rocket:
</div>
<br />

>  Modern, powerful web application framework for [Node.js](http://nodejs.org).
> 
<div align="center">

[![NPM Version][npm-image]][npm-url]
[![GitHub Release Version][github-release-image]][github-release]
[![NPM Downloads][downloads-image]][npm-url]
[![Build][travis-image]][travis-url]
[![Coverage Status][coveralls-image]][coveralls-url]
<br class="badge-separator" />
<span class="badge-patreon"><a href="https://patreon.com/ialopezg" title="Donate to this project using Patreon"><img src="https://img.shields.io/badge/patreon-donate-yellow.svg" alt="Patreon donate button" /></a></span>
<span class="badge-opencollective"><a href="https://opencollective.com/ialopezg" title="Donate to this project using Open Collective"><img src="https://img.shields.io/badge/open%20collective-donate-yellow.svg" alt="Open Collective donate button" /></a></span>
<span class="badge-paypal"><a href="https://www.paypal.me/isidrolopezg" title="Donate to this project using Open Collective"><img src="https://img.shields.io/badge/paypal-donate-yellow.svg" alt="Open Collective donate button" /></a></span>

</div>

## Description

[CoreJS](https://github.com/ialopezg/corejs) is a toolset that helps you to develop and debug modern applications. This tool is made to be used in [Node.js](https://nodejs.org), which allows you to easily build efficient, scalable applications. It uses modern JavaScript, is built with [TypeScript](https://typescriptlang.org) and bring best JavaScript concepts.

## Installation

  ```bash
  npm install @ialopezg/corejs
  ```


## Quick Start

### Basic App Setup

#### app.ts

```ts
import { Application as ApplicationFactory } from '@ialopezg/corejs';
import * as express from 'express'

export class Application implements ApplicationFactory {
    constructor(private application: express.Application) {
      // do something
    }
  
    start() {
      // do something before server starts
      
      const port = process.env.APP_PORT || 3000;
      this.application.listen(port, () => {
        console.log(`Application listen on port: ${port}`);
      });
    }
}
```

### app.module.ts

```ts
import { Module } from '@ialopezg/corejs';

@Module({})
export class AppModule {}
```

### server.ts

```ts
import { AppRunner } from '@ialopezg/corejs';
import { AppModule } from './app.module';
import { Application } from './app';

AppRunner.run(Application, AppModule);
```

## Setup first controller

Controllers layer is responsible for handling HTTP requests. This is how we create controller in Nest application:

```ts
import { Controller } from '@ialopezg/corejs';
import { NextFunction, Request, Response } from 'express';

@Controller({ path: 'users' })
class UsersController {
  @RequestMapping({ path: '/' })
  getAllUsers(request: Request, response: Response, next: NextFunction) {
    response.status(201).json({});
  }
}
```

## Features

- Compatible with both TypeScript and ES6 (Recommend to use [TypeScript](https://www.typescriptlang.org/)
- Based on well-known libraries (Express / socket.io) so you could easily use your experience
- Easy to learn - syntax is really similar to Angular / Spring (Java)
- Dependency Injection, Inversion of Control Container
- Exceptions handler layer (helps to focus on logic)
- Own modularity system
- Sockets module (based on [socket.io](https://github.com/socketio/socket.io))

## Future

CoreJS is very much still a work in progress. There is still some things to finish:

- Better test utilities
- Validation helpers
- Starter repos
- Increase test coverage
- Gateway middlewares
- and more...

## People

Author - [Isidro A. Lopez G.](https://github.com/ialopezg)

## License

CoreJS is licensed under [MIT](LICENSE) license.

---

&copy; Copyright 1995-present - [Isidro A. Lopez G.](https://ialopezg.com/)

[npm-image]: https://img.shields.io/npm/v/@ialopezg/corejs.svg
[npm-url]: https://npmjs.org/package/@ialopezg/corejs
[github-release]: https://github.com/ialopezg/corejs/releases
[github-release-image]: https://img.shields.io/github/v/release/ialopezg/corejs.svg?logo=github
[codecov-url]: https://codecov.io/gh/ialopezg/corejs/branch/main
[codecov-image]: https://codecov.io/gh/ialopezg/corejs/branch/main/graph/badge.svg
[downloads-image]: https://img.shields.io/npm/dm/@ialopezg/corejs.svg
[downloads-url]: https://npmcharts.com/compare/@ialopezg/corejs?minimal=true
[travis-url]: https://app.travis-ci.com/ialopezg/corejs.svg?branch=main
[travis-image]: https://app.travis-ci.com/ialopezg/corejs.svg?branch=main
[coveralls-image]: https://coveralls.io/repos/github/ialopezg/corejs/badge.svg?branch=main
[coveralls-url]: https://coveralls.io/github/ialopezg/corejs?branch=main
[contributors]: https://img.shields.io/badge/all_contributors-1-orange.svg?style=flat-square
[contributors-link]: #people
