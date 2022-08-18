// Tests for the CLI part of the project.

import { env } from 'node:process';
import { afterEach, describe, test, expect, vi } from 'vitest';

import manifest from '../package.json';
import {
  getHelpText,
  checkForUpdates,
} from '../src/utils/cli';
import { logger } from '../src/utils/logger';

afterEach(() => {
  vi.restoreAllMocks();
});


describe('utilities/cli', () => {
  // Make sure the help message remains the same. If we are changing the help
  // message, then make sure to run `vitest` with the `--update-snapshot` flag.
  test('render help text', () => expect(getHelpText()).toMatchSnapshot());


  // Make sure the update message is shown when the current version is not
  // the latest version.
  test('print update message when newer version exists', async () => {
    const consoleSpy = vi.spyOn(logger, 'log');

    await checkForUpdates({
      ...manifest,
      version: '0.0.0',
    });

    expect(consoleSpy).toHaveBeenCalledOnce();
    expect(consoleSpy).toHaveBeenLastCalledWith(
      expect.stringContaining('UPDATE'),
      expect.stringContaining('latest'),
    );
  });

  // Make sure the update message is not shown when the latest version is
  // running.
  test('do not print update message when on latest version', async () => {
    const consoleSpy = vi.spyOn(logger, 'log');

    await checkForUpdates({
      ...manifest,
      version: '99.99.99',
    });

    expect(consoleSpy).not.toHaveBeenCalled();
  });

  // Make sure an update check does not occur when the NO_UPDATE_CHECK env var
  // is set.
  test('do not check for updates when NO_UPDATE_CHECK is set', async () => {
    const consoleSpy = vi.spyOn(logger, 'log');

    env.NO_UPDATE_CHECK = 'true';
    await checkForUpdates({
      ...manifest,
      version: '0.0.0',
    });
    env.NO_UPDATE_CHECK = undefined;

    expect(consoleSpy).not.toHaveBeenCalled();
  });
});
