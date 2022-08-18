#!/usr/bin/env node

// scr/main.ts

import { cwd as getPwd, exit, env, stdout } from 'node:process';
import path from 'node:path';
import chalk from 'chalk';
import clipboard from 'clipboardy';
import manifest from '../package.json';
import { resolve } from './utils/promise';
import { logger } from './utils/logger';
import { parseArguments, getHelpText, checkForUpdates } from './utils/cli';

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
