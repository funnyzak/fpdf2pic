// CLI-related utility functions.

import { env } from 'process';
import chalk from 'chalk';
import chalkTemplate from 'chalk-template';
import parseArgv from 'arg';
import checkForUpdate from 'update-check';
import { resolve } from './promise';
import { logger } from './logger';
import type { Arguments } from '../types';

// The help text for the CLI.
const helpText = chalkTemplate`
{bold.cyan fpdf2pic} - A command line tool for converting PDF to images.

{bold Usage:}
  {cyan pdf2pic} [options]
  {cyan pdf2pic} --help
  {cyan pdf2pic} --version
  {cyan pdf2pic} -i {underline pdf_path} [-o {underline output_path}]

{bold Options:}
  {cyan -h, --help}                          Show message.
  {cyan -d, --debug}                         Show debugging information.
  {cyan -v, --version}                       Show version.
  {cyan -i, --input-path}                    To convert the PDF file path, you can be a single file or folder path.
  {cyan -o, --output-dir}                    the directory to output the images, The default will convert all pages, eg: -o ./pdf_images.
  {cyan -P, --page-range}                    The page range to convert,  eg: -P 1,3、 -P 1.
  {cyan -W, --width}                         The max width of the image to be converted, eg: -W 1024.
  {cyan -H, --height}                        The max height of the image to be converted, eg: -H 768.
  {cyan -F, --format}                        The format of the image to be converted, eg: -F png.
  {cyan -Q, --quality}                       The quality of the image to be converted, eg: -Q 80.
  {cyan -D, --density}                       The density of the image to be converted, eg: -D 300.
  {cyan -C, --compression}                   The compression method of the image to be converted, eg: -C jpeg.

  By default, {cyan fpdf2pic} The images will be converted to the folder where the PDF is located when the output path is not specified.
`;

/**
 * Returns the help text.
 *
 * @returns The help text shown when the `--help` option is used.
 */
export const getHelpText = (): string => helpText;

// The options the CLI accepts, and how to parse them.
const options = {
  '--help': Boolean,
  '--version': Boolean,
  '--input-path': String,
  '--output-dir': String,
  '--debug': Boolean,
  '--width': Number,
  '--height': Number,
  '--format': String,
  '--quality': Number,
  '--density': Number,
  '--compression': String,
  '--page-range': String,

  // A list of aliases for the above options.
  '-h': '--help',
  '-d': '--debug',
  '-v': '--version',
  '-i': '--input-path',
  '-o': '--output-dir',
  '-W': '--width',
  '-H': '--height',
  '-F': '--format',
  '-Q': '--quality',
  '-D': '--density',
  '-C': '--compression',
  '-P': '--page-range',
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
    `The latest version of \`fpdf2pic\` is ${update.latest}`
  );
};
