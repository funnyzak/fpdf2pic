# fpdf2pic [![Build Status][build-status-image]][build-status]

[![license][license-image]][repository-url]
[![Release Date][rle-image]][rle-url]
[![Sourcegraph][sg-image]][sg-url]
[![NPM version][npm-image]][npm-url]
[![GitHub repo size][repo-size-image]][repository-url]
[![npm download][download-image]][download-url]

[repo-size-image]: https://img.shields.io/github/repo-size/funnyzak/fpdf2pic
[build-status-image]: https://img.shields.io/github/workflow/status/funnyzak/fpdf2pic/CI
[build-status]: https://github.com/funnyzak/fpdf2pic/actions
[license-image]: https://img.shields.io/github/license/funnyzak/fpdf2pic.svg?style=flat-square
[repository-url]: https://github.com/funnyzak/fpdf2pic
[npm-image]: https://img.shields.io/npm/v/fpdf2pic.svg?style=flat-square
[npm-url]: https://npmjs.org/package/fpdf2pic
[download-image]: https://img.shields.io/npm/dm/fpdf2pic.svg?style=flat-square
[download-url]: https://npmjs.org/package/fpdf2pic
[sg-image]: https://img.shields.io/badge/view%20on-Sourcegraph-brightgreen.svg?style=flat-square
[sg-url]: https://sourcegraph.com/github.com/funnyzak/fpdf2pic
[rle-image]: https://img.shields.io/github/release-date/funnyzak/fpdf2pic.svg
[rle-url]: https://github.com/funnyzak/fpdf2pic/releases/latest

A command line tool for converting PDF to images.

## Prerequisite

* [node >= 12.x](http://nodejs.cn/download/)
* [graphicsmagick](http://www.graphicsmagick.org/README.html#installation)
* [ghostscript](https://www.ghostscript.com/)

## Installation

```sh
npm i fpdf2pic -g
```

## Usage

```sh
# show help
fpdf2pic -h

# Convert a PDF to images
fpdf2pic -i inputfilepath.pdf -o outputdirpath
```

## FAQ

### How to install graphicsmagick?

See [installation](http://www.graphicsmagick.org/README.html#installation).

## Author

| [![twitter/funnyzak](https://s.gravatar.com/avatar/c2437e240644b1317a4a356c6d6253ee?s=70)](https://twitter.com/funnyzak 'Follow @funnyzak on Twitter') |
| ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [funnyzak](https://yyccme/)                                                                                                                           |

## License

MIT License © 2022 [funnyzak](https://github.com/funnyzak)
