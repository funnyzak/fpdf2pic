import PDFJS from 'pdfjs-dist';

export interface PdfDocument {
  numpages: number;
  info: any;
  metadata: any;
  text: string;
  version: string;
}

export async function getPdfDocument(dataBuffer: any): Promise<PdfDocument> {
  PDFJS.disableWorker = true;
  let ret: PdfDocument = {
    numpages: 0,
    info: null,
    metadata: null,
    text: '',
    version: PDFJS.version
  };

  let doc = await PDFJS.getDocument(dataBuffer).promise;
  ret.numpages = doc.numPages;
  doc.destroy();

  return ret;
}
