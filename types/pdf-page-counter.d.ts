// Type definitions for pdf-page-counter 1.0.3
// Project: https://gitlab.com/decebal2dac/pdf-page-counter

declare module 'pdf-page-counter' {
  export = PDF;

  function PDF(dataBuffer: Buffer, options?: PDF.Options): Promise<PDF.Result>;

  namespace PDF {
    interface Result {
      numpages: number;
      info: any;
      metadata: any;
      text: string;
      versin: string;
    }
    interface Options {
      max?: number | undefined;
    }
  }
}
