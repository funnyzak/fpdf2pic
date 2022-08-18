// CLI-related utility functions.

import { env } from 'node:process';
import chalk from 'chalk';
import chalkTemplate from 'chalk-template';
import parseArgv from 'arg';
import checkForUpdate from 'update-check';
import { resolve } from './promise';
import { logger } from './logger';
import type { Arguments } from '../types';

// The help text for the CLI.
const helpText = chalkTemplate`
  {bold.cyan fpdf2jpg} - A pdf to image tool

  {bold USAGE}

    {bold $} {cyan fpdf2jpg} --help
    {bold $} {cyan fpdf2jpg} --version
    {bold $} {cyan fpdf2jpg} pdf_path
    {bold $} {cyan fpdf2jpg} [-i {underline pdf_path} [-o{underline output_path}] ]

    By default, {cyan fpdf2jpg} The images will be converted to the folder where the PDF is located when the output path is not specified.

  {bold OPTIONS}

    --help                              Shows this help message

    -d, --debug                         Show debugging information

    -v, --version                       Displays the current version of fpdf2jpg

    -i  --input-pdf-path                The path to the pdf to convert to images

    -o, --output-dir                    the directory to output the images to

`;

/**
 * Returns the help text.
 *
 * @returns The help text shown when the `--help` option is used.
 */
export const getHelpText = (): string => helpText;

/**
 * Parse and return the endpoints from the given string.
 *
 * @param uriOrPort - The endpoint to listen on.
 * @returns A list of parsed endpoints.
 */

// The options the CLI accepts, and how to parse them.
const options = {
  '--help': Boolean,
  '--version': Boolean,
  '--input-pdf-path': String,
  '--output-dir': String,
  '--debug': Boolean,
  // A list of aliases for the above options.
  '-h': '--help',
  '-d': '--debug',
  '-v': '--version',
  '-i': '--input-pdf-path',
  '-o': '--output-dir'
};

/**
 * Parses the program's `process.argv` and returns the options and arguments.
 *
 * @returns The parsed options and arguments.
 */
export const parseArguments = (): Arguments => parseArgv(options);

/**
 * Checks for updates to this package. If an update is available, it brings it
 * to the user's notice by printing a message to the console.
 */
export const checkForUpdates = async (manifest: object): Promise<void> => {
  // Do not check for updates if the `NO_UPDATE_CHECK` variable is set.
  if (env.NO_UPDATE_CHECK) return;

  // Check for a newer version of the package.
  const [error, update] = await resolve(checkForUpdate(manifest));

  // If there is an error, throw it; and if there is no update, return.
  if (error) throw error;
  if (!update) return;

  // If a newer version is available, tell the user.
  logger.log(
    chalk.bgRed.white(' UPDATE '),
    `The latest version of \`fpdf2jpg\` is ${update.latest}`
  );
};
