// Type definitions for the CLI.

// An error thrown by any native Node modules.
export declare interface NodeError extends Error {
  code: string;
}

// A path to a file/remote resource.
export declare type Path = string;

// The options you can pass to the CLI.
export declare interface Options {
  '--help': boolean;
  '--version': boolean;
  '--debug': boolean;
  '--output-dir': Path;
  '--input-pdf-path': Path;
}

// The arguments passed to the CLI (the options + the positional arguments)
export declare type Arguments = Partial<Options> & {
  _: string[];
};
