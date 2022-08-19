import CmdExists from 'command-exists';
import { resolve } from './promise';

export async function commandExists(commandString: string): Promise<boolean> {
  const [commandError] = await resolve(CmdExists(commandString));
  return commandError === undefined;
}
