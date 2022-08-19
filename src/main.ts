#!/usr/bin/env node

// scr/main.ts

import { existsSync, lstatSync, mkdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { exit } from 'node:process';
import boxen from 'boxen';
import chalkTemplate from 'chalk-template';
import chalk from 'chalk';
// import clipboard from 'clipboardy';
import { globby } from 'globby';
import PDFPageCounter from 'pdf-page-counter';
import { fromPath } from 'pdf2pic';
import type { Options as pdf2picOptions } from 'pdf2pic/dist/types/options';
import manifest from '../package.json';
import { checkForUpdates, getHelpText, parseArguments } from './utils/cli';
import { logger } from './utils/logger';
import { resolve } from './utils/promise';
import { commandExists } from './utils';

// Determine whether there is installation of GraphicsMagick
const isGraphicsMagickInstalled = await commandExists('gm');
if (!isGraphicsMagickInstalled) {
  logger.log(chalkTemplate`
  {red Oops !!! GraphicsMagick Need to be installed.}\n
  {bold In Mac OS X, you can simply use Homebrew and do:}: {cyan brew install graphicsmagick}
  {bold In Windows, you can see this:}: {cyan http://www.graphicsmagick.org/INSTALL-windows.html}
  `);
  exit(0);
}

// Parse the options passed by the user.
const [parseError, args] = await resolve(parseArguments());
if (parseError || !args) {
  logger.error(parseError.message);
  exit(1);
}

// To convert the range of the page
let pageRange = (args['--page-range'] || '-1').split(',').map((v) => Number(v));

// Check for updates to the package unless the user sets the `NO_UPDATE_CHECK`
// variable.
const [updateError] = await resolve(checkForUpdates(manifest));
if (updateError) {
  const suffix = args['--debug'] ? ':' : ' (use `--debug` to see full error)';
  logger.warn(`Checking for updates failed${suffix}`);

  if (args['--debug']) logger.error(updateError.message);
}

// If the `version` or `help` arguments are passed, print the version or the
// help text and exit.
if (args['--version']) {
  logger.log(manifest.version);
  exit(0);
}
if (args['--help']) {
  logger.log(getHelpText());
  exit(0);
}

// Output path
let output_dir = '';

// PDF file list to be converted
let pdf_file_list: string[] = [];

// options for pdf2pic
let pdf_convert_options: pdf2picOptions = {
  quality: args['--quality'] || 100,
  format: args['--format'] || 'png',
  width: args['--width'] || undefined,
  height: args['--height'] || undefined,
  density: args['--density'] || 300,
  savePath: './',
  saveFilename: 'untitled',
  compression: args['--compression'] || 'jpeg'
};

if (args['--output-dir']) {
  const out_dir = args['--output-dir'];

  if (existsSync(out_dir)) {
    if (lstatSync(out_dir).isFile()) {
      logger.error(`Output directory ${out_dir} cannot be a file.`);
      exit(0);
    }
    output_dir = out_dir;
  }
}

if (args['--input-path']) {
  const pdf_path = args['--input-path'];

  if (!existsSync(pdf_path)) {
    logger.error(`Input PDF path ${pdf_path} does not exist.`);
    exit(1);
  }

  const input_path_is_file = lstatSync(pdf_path).isFile();
  if (input_path_is_file) {
    pdf_file_list.push(pdf_path);
  } else {
    pdf_file_list = await globby(pdf_path, {
      expandDirectories: {
        extensions: ['pdf']
      }
    });
  }

  if (output_dir === '') {
    output_dir = input_path_is_file ? path.dirname(pdf_path) : pdf_path;
  }
}

if (pdf_file_list.length === 0) {
  logger.error('No PDF file found.');
  exit(1);
}

const previewSettingText = chalkTemplate`
  Conversion preview:

  {bold Output directory:} {cyan ${output_dir}}
  {bold The file count to be converted:} {cyan ${pdf_file_list.length}}
  {bold The file to be converted:} {cyan ${pdf_file_list.join(', ')}}
  {bold Page range:} {cyan ${pageRange[0] === -1 ? 'All' : pageRange}}
  {bold Convert parameters:} {cyan width: ${
    pdf_convert_options.width
  }, height: ${pdf_convert_options.height}, quality: ${
  pdf_convert_options.quality
}, format: ${pdf_convert_options.format}, density: ${
  pdf_convert_options.density
}, compression: ${pdf_convert_options.compression}}
`;

logger.log(
  boxen(previewSettingText, {
    padding: 1,
    borderColor: 'green',
    margin: 1
  })
);
logger.info(chalkTemplate`{bold Start Converting...}`);

for (let i = 0; i < pdf_file_list.length; i++) {
  const _cur_pdf = pdf_file_list[i];
  const _cur_pdf_name = path.basename(_cur_pdf, '.pdf');

  const cur_pdf_out_dir = path.join(output_dir, _cur_pdf_name);
  // Create the current PDF output directory
  if (!existsSync(cur_pdf_out_dir)) {
    mkdirSync(cur_pdf_out_dir);
  }

  let pdf_data_buffer = readFileSync(_cur_pdf);
  const [cur_pdf_parse_error, cur_pdf_parse_data] = await resolve(
    PDFPageCounter(pdf_data_buffer)
  );

  logger.log(
    chalkTemplate`\nCurrent PDF(${i + 1}/${
      pdf_file_list.length
    }): {cyan ${_cur_pdf}}\nSave images to: {cyan ${cur_pdf_out_dir}}`
  );

  if (!cur_pdf_parse_error) {
    const storeAsImage = fromPath(_cur_pdf, {
      ...pdf_convert_options,
      saveFilename: _cur_pdf_name,
      savePath: cur_pdf_out_dir
    });

    for (let i = 1; i <= cur_pdf_parse_data.numpages; i++) {
      if (pageRange[0] !== -1) {
        if (pageRange.length > 1) {
          if (pageRange[0] > i || pageRange[1] < i) {
            continue;
          }
        } else {
          if (i !== pageRange[0]) continue;
        }
      }

      const [store_image_error] = await resolve(storeAsImage(i));

      logger.log(
        `Converting page ${chalk.bold(i)}/${cur_pdf_parse_data.numpages}...`
      );
      if (store_image_error) {
        logger.error(store_image_error.message);
      }
    }
    logger.log(chalkTemplate`Convert ${chalk.green(_cur_pdf_name)} completed.`);
  } else {
    logger.error(cur_pdf_parse_error.message);
  }
}
