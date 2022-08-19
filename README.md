# fpdf2pic [![Build Status][build-status-image]][build-status] [![Sourcegraph][sg-image]][sg-url]

[![license][license-image]][repository-url]
[![node](https://img.shields.io/node/v/fpdf2pic.svg)](https://nodejs.org/)
[![NPM version][npm-image]][npm-url]
[![Release Date][rle-image]][rle-url]
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

![preview](https://raw.githubusercontent.com/funnyzak/fpdf2pic/main/public/preview.png)

## Prerequisite

* [node >= 14.x](http://nodejs.cn/download/)
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

## Help

    By default, fpdf2pic The images will be converted to the folder where the PDF is located when the output path is not specified.

    The following options are available:

    -h, --help                          Shows this help message

    -d, --debug                         Show debugging information

    -v, --version                       Displays the current version of fpdf2pic

    -i, --input-path                    To convert the PDF file path, you can be a single file or folder path

    -o, --output-dir                    the directory to output the images, The default will convert all pages, eg: -o ./pdf_images

    -P, --page-range                    The page range to convert,  eg: -P 1,3、 -P 1

    -W, --width                         The max width of the image to be converted, eg: -W 1024

    -H, --height                        The max height of the image to be converted, eg: -H 768

    -F, --format                        The format of the image to be converted, eg: -F png

    -Q, --quality                       The quality of the image to be converted, eg: -Q 80

    -D, --density                       The density of the image to be converted, eg: -D 300

    -C, --compression                   The compression method of the image to be converted, eg: -C jpeg


## FAQ

### How to install graphicsmagick?

See [installation](http://www.graphicsmagick.org/README.html#installation).

## Author

| [![twitter/funnyzak](https://s.gravatar.com/avatar/c2437e240644b1317a4a356c6d6253ee?s=70)](https://twitter.com/funnyzak 'Follow @funnyzak on Twitter') |
| ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [funnyzak](https://yyccme/)                                                                                                                           |

## License

MIT License © 2022 [funnyzak](https://github.com/funnyzak)
