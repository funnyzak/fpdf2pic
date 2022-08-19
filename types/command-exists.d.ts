declare module 'command-exists' {
  export = CommandExists;

  function CommandExists(command: string): Promise<any>;
}
