#!/usr/bin/env node

// scr/main.ts

import { cwd as getPwd, exit, env, stdout } from 'node:process';
import { readFileSync, existsSync, lstatSync } from 'node:fs';
import path from 'node:path';
import chalk from 'chalk';
import clipboard from 'clipboardy';
import manifest from '../package.json';
import { resolve } from './utils/promise';
import { logger } from './utils/logger';
import { parseArguments, getHelpText, checkForUpdates } from './utils/cli';
import { globby } from 'globby';
import { fromPath } from 'pdf2pic';
import PDFParse from 'pdf-parse';
import type { Options as pdf2picOptions } from 'pdf2pic/dist/types/options';

// Parse the options passed by the user.
const [parseError, args] = await resolve(parseArguments());
if (parseError || !args) {
  logger.error(parseError.message);
  exit(1);
}

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

// the parent dir path of convert pdf to jpg
let convert_target_dir = '';

// pdf path list
let pdf_file_path_list: string[] = [];

// Pdf convert options
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
    convert_target_dir = out_dir;
  }
}

if (args['--input-path']) {
  const pdf_path = args['--input-path'];

  if (!existsSync(pdf_path)) {
    logger.error(`Input PDF path ${pdf_path} does not exist.`);
    exit(1);
  }

  const if_file = lstatSync(pdf_path).isFile();
  if (if_file) {
    pdf_file_path_list.push(pdf_path);
  } else {
    pdf_file_path_list = await globby(pdf_path, {
      expandDirectories: {
        extensions: ['pdf']
      }
    });
  }

  if (convert_target_dir === '') {
    convert_target_dir = path.dirname(pdf_path);
  }

  logger.info(`Convert output dir path: ${convert_target_dir}`);
  logger.info(`Input pdf paths: ${pdf_file_path_list.join(' ')}`);

  for (const _pdf of pdf_file_path_list) {
    logger.log('current pdf path: ' + _pdf);

    let pdf_data_buffer = readFileSync(_pdf);
    const parse_data = await PDFParse(pdf_data_buffer);

    const storeAsImage = fromPath(_pdf, {
      ...pdf_convert_options,
      savePath: convert_target_dir
    });

    for (let i = 1; i <= parse_data.numpages; i++) {
      storeAsImage(i).then((resolve) => {
        console.log('Page ${i} is now converted as image');

        return resolve;
      });
    }
  }
}
