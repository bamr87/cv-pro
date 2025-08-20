import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';

// Configure worker (pdfjs v4+). Host the worker from the package.
// Vite will bundle this import path correctly.
// @ts-ignore - pdfjs types may not expose exact path
GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString();

export async function extractTextFromPdf(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await getDocument({ data: arrayBuffer }).promise;
  const max = pdf.numPages;
  const parts: string[] = [];
  for (let i = 1; i <= max; i += 1) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const text = content.items.map((i: any) => ('str' in i ? i.str : '')).join(' ');
    parts.push(text);
  }
  return parts.join('\n');
}


