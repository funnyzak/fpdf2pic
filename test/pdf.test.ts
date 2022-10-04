// Tests for the Pdf part of the project.

import { afterEach, describe, expect, test, vi } from 'vitest';

import path from 'path';
import { getPdfDocument } from '../src/utils/pdf';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('utils/pdf', () => {
  test('get pdf document', async () => {
    const sample_pdf_path = path.join(__dirname, '../public/sample.pdf');
    const pdfDocument = await getPdfDocument(sample_pdf_path);

    expect(pdfDocument.numpages).equals(1);
  });
});
