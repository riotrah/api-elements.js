# Fury API Blueprint Serializer

[![NPM version](https://img.shields.io/npm/v/fury-adapter-apib-serializer.svg)](https://www.npmjs.org/package/fury-adapter-apib-serializer)
[![License](https://img.shields.io/npm/l/fury-adapter-apib-serializer.svg)](https://www.npmjs.org/package/fury-adapter-apib-serializer)

This adapter provides support for serializing [API Blueprint](https://apiblueprint.org/) in [Fury.js](https://github.com/apiaryio/api-elements.js/tree/master/packages/fury) from refract elements.

## Install

```sh
npm install fury-adapter-apib-serializer
```

## Usage

```js
import fury from 'fury';
import apibSerializer from 'fury-adapter-apib-serializer';

fury.use(apibSerializer);

// Assume `api` is a Minim element instance, e.g. from `fury.parse(...)`
fury.serialize({api}, (err, content) => {
  fs.write('serialized.apib', content, 'utf8');
});
```
