# fpdf2pic

[![js-standard-style](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://github.com/feross/standard)
[![action][ci-image]][ci-url]
[![license][license-image]][repository-url]
[![NPM version][npm-image]][npm-url]
[![npm download][download-image]][download-url]

[ci-image]: https://img.shields.io/github/workflow/status/funnyzak/fpdf2pic/CI
[ci-url]: https://github.com/funnyzak/fpdf2pic/actions
[license-image]: https://img.shields.io/github/license/funnyzak/fpdf2pic.svg?style=flat-square
[repository-url]: https://github.com/funnyzak/fpdf2pic
[npm-image]: https://img.shields.io/npm/v/fpdf2pic.svg?style=flat-square
[npm-url]: https://npmjs.org/package/fpdf2pic
[download-image]: https://img.shields.io/npm/dm/fpdf2pic.svg?style=flat-square
[download-url]: https://npmjs.org/package/fpdf2pic

A command line tool for converting PDF to images.

## Prerequisite

* node >= 12.x
* [graphicsmagick](http://www.graphicsmagick.org/README.html#installation) [[brew](https://formulae.brew.sh/formula/graphicsmagick)]
* [ghostscript](https://www.ghostscript.com/) [[brew](https://formulae.brew.sh/formula/ghostscript)]

## installation

```sh
npm i fpdf2pic -g
```

## Usage

```js
fpdf2pic -i inputfilepath.pdf -o outputdirpath
```

## Author

| [![twitter/funnyzak](https://s.gravatar.com/avatar/c2437e240644b1317a4a356c6d6253ee?s=70)](https://twitter.com/funnyzak 'Follow @funnyzak on Twitter') |
| ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [funnyzak](https://yycc.me/)                                                                                                                           |

## License

MIT License © 2022 [funnyzak](https://github.com/funnyzak)
