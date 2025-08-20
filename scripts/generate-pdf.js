import playwright from 'playwright';
import path from 'node:path';
import fs from 'node:fs/promises';

const PUBLIC_ASSETS_FOLDER = 'public';

async function generatePDFFromHTML(htmlFile = 'dist/resume-print.html') {
  const useTailoredResume = process.env['VITE_USE_TAILORED_RESUME'] === 'true';
  
  // Determine output PDF path
  const resumePDFPath = useTailoredResume
    ? path.join(
        PUBLIC_ASSETS_FOLDER,
        `${await (async () => {
          return fs
            .readFile(path.join(PUBLIC_ASSETS_FOLDER, 'resume.tailored.json'), {
              encoding: 'utf-8',
            })
            .then(resume => JSON.parse(resume))
            .then(resume => resume.meta.company.name);
        })()}.pdf`,
      )
    : path.join(PUBLIC_ASSETS_FOLDER, 'resume.pdf');

  // Check if HTML file exists
  try {
    await fs.access(htmlFile);
  } catch {
    throw new Error(`HTML file ${htmlFile} not found. Run 'bun run build:html' first.`);
  }

  const browser = await playwright.chromium.launch({
    args: ['--disable-dev-shm-usage'],
  });
  
  const page = await browser.newPage();
  await page.emulateMedia({ media: 'print' });
  
  // Load the local HTML file
  const htmlPath = path.resolve(htmlFile);
  await page.goto(`file://${htmlPath}`, {
    waitUntil: 'networkidle',
  });
  
  await page.pdf({
    format: 'a4',
    path: resumePDFPath,
    preferCSSPageSize: true,
    printBackground: true,
  });

  await browser.close();
  
  console.log(`Generated PDF: ${resumePDFPath}`);
}

const htmlFile = process.argv[2];
await generatePDFFromHTML(htmlFile);