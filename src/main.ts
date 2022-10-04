#!/usr/bin/env node

import chalk from 'chalk';
import chalkTemplate from 'chalk-template';
import { existsSync, lstatSync, mkdirSync, readFileSync } from 'fs';
import path from 'path';
import { exit } from 'process';
import { globby } from 'globby';
import { getPdfDocument } from './utils/pdf';
import { fromPath } from 'pdf2pic';
import type { Options as pdf2picOptions } from 'pdf2pic/dist/types/options';
import manifest from '../package.json';
import { commandExists } from './utils';
import { checkForUpdates, getHelpText, parseArguments } from './utils/cli';
import { logger } from './utils/logger';
import { resolve } from './utils/promise';

const run = async (): Promise<void> => {
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

  let cli_options = {
    help: args['--help'],
    version: args['--version'],
    debug: args['--debug'],
    output_dir: args['--output-dir'] || '',
    input_path: args['--input-path'],
    width: args['--width'] || undefined,
    height: args['--height'] || undefined,
    format: args['--format'] || 'png',
    quality: args['--quality'] || 100,
    density: args['--density'] || 300,
    compression: args['--compression'] || 'jpeg',
    page_range: args['--page-range']
  };

  // if debug, then set log level to debug
  if (cli_options.debug) {
    logger.setLevel('debug');
  }
  logger.debug('command options:', JSON.stringify(cli_options));

  // To convert the range of the page
  let pageRange = (cli_options.page_range || '-1')
    .split(',')
    .map((v) => Number(v));

  // Check for updates to the package unless the user sets the `NO_UPDATE_CHECK`
  // variable.
  const [updateError] = await resolve(checkForUpdates(manifest));
  if (updateError) {
    const suffix = cli_options.debug
      ? ':'
      : ' (use `--debug` to see full error)';
    logger.warn(`Checking for updates failed${suffix}`);

    if (cli_options.debug) logger.error(updateError.message);
  }

  // If the `version` or `help` arguments are passed, print the version or the
  // help text and exit.
  if (cli_options.version) {
    logger.log(manifest.version);
    exit(0);
  }
  if (cli_options.help) {
    logger.log(getHelpText());
    exit(0);
  }

  // Output path
  let output_dir = cli_options.output_dir;

  // PDF file list to be converted
  let pdf_file_list: string[] = [];

  // options for pdf2pic
  let pdf_convert_options: pdf2picOptions = {
    quality: cli_options.quality,
    format: cli_options.format,
    width: cli_options.width,
    height: cli_options.height,
    density: cli_options.density,
    savePath: './',
    saveFilename: 'untitled',
    compression: cli_options.compression
  };

  if (output_dir !== '') {
    if (existsSync(output_dir)) {
      if (lstatSync(output_dir).isFile()) {
        output_dir = path.dirname(output_dir);
      }
    } else {
      mkdirSync(output_dir);
    }
  }

  if (cli_options.input_path) {
    const pdf_path = cli_options.input_path;

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
{bold Convert options:}
{bold Output DIR:} {cyan ${output_dir}}
{bold pdf file count:} {cyan ${pdf_file_list.length}}
{bold pdf file list:} {cyan ${pdf_file_list.join(', ')}}
{bold Page range:} {cyan ${pageRange[0] === -1 ? 'All' : pageRange}}
{bold Convert parameters:} {cyan width: ${pdf_convert_options.width}, height: ${
    pdf_convert_options.height
  }, quality: ${pdf_convert_options.quality}, format: ${
    pdf_convert_options.format
  }, density: ${pdf_convert_options.density}, compression: ${
    pdf_convert_options.compression
  }}
`;

  logger.log(previewSettingText);
  logger.log(chalkTemplate`\n{bold PDF2Pic...}`);

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
      getPdfDocument(pdf_data_buffer)
    );

    const current_absolute_path = path.resolve(cur_pdf_out_dir);
    logger.log(
      chalkTemplate`\nCurrent PDF(${i + 1}/${
        pdf_file_list.length
      }): {cyan ${_cur_pdf}}\nSave images to: {cyan ${current_absolute_path}}`
    );

    if (!cur_pdf_parse_error) {
      const storeAsImage = fromPath(_cur_pdf, {
        ...pdf_convert_options,
        saveFilename: _cur_pdf_name,
        savePath: current_absolute_path
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
          `PDF: ${chalk.cyan(_cur_pdf_name)}, Page ${chalk.bold(i)}/${
            cur_pdf_parse_data.numpages
          }, converted.`
        );
        if (store_image_error) {
          logger.error(store_image_error.message);
        }
      }
      logger.log(chalkTemplate`PDF2Pic ${chalk.green(_cur_pdf)} done.`);
    } else {
      logger.error(`Parse PDF ${_cur_pdf} failed.`);
      logger.debug(`Error message: ${cur_pdf_parse_error.message}`);
    }
  }
};

run();
