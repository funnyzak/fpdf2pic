declare module 'pdfjs-dist' {
  export = pdfjs;

  // pdfjs object declare includes disabledWorker property
  // and getDocument method
  const pdfjs: {
    disableWorker: boolean;
    version: string;
    getDocument: (dataBuffer: any) => { promise: Promise<any> };
  };
}
