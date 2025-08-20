import fs from 'node:fs/promises';
import path from 'node:path';
import { build } from 'vite';
import cssnano from 'cssnano';
import postcss from 'postcss';

async function generateStandaloneHTML(mode = 'normal') {
  console.log(`Building ${mode} version...`);
  
  const useTailoredResume = process.env['VITE_USE_TAILORED_RESUME'] === 'true';
  
  // Phase 1: Build the SSR server bundle
  console.log('Phase 1: Building SSR server bundle...');
  await build({
    define: {
      'import.meta.env.VITE_USE_TAILORED_RESUME': JSON.stringify(useTailoredResume),
    },
    build: {
      outDir: `dist-ssr-${mode}`,
      emptyOutDir: true,
      ssr: 'src/entry-server.js',
      minify: 'esbuild',
      sourcemap: false,
      rollupOptions: {
        output: {
          entryFileNames: 'entry-server.js'
        }
      }
    }
  });

  // Phase 2: Build client assets for CSS extraction
  console.log('Phase 2: Building client assets...');
  await build({
    define: {
      'import.meta.env.VITE_USE_TAILORED_RESUME': JSON.stringify(useTailoredResume),
    },
    build: {
      outDir: `dist-client-${mode}`,
      emptyOutDir: true,
      minify: 'esbuild',
      sourcemap: false,
      rollupOptions: {
        output: {
          assetFileNames: 'assets/[name].[ext]'
        }
      }
    }
  });

  // Phase 3: Execute the SSR directly (not the bundled version)
  console.log('Phase 3: Executing SSR to generate HTML...');
  
  // Import and execute the source entry-server.js directly
  const entryServerPath = path.resolve('src/entry-server.js');
  delete require.cache[entryServerPath]; // Clear cache
  const { render } = await import(`${entryServerPath}?t=${Date.now()}`);
  const { html: renderedHtml, head } = await render(mode);

  // Phase 4: Extract and inline CSS
  console.log('Phase 4: Inlining CSS...');
  const cssFiles = await fs.readdir(path.join(`dist-client-${mode}`, 'assets'))
    .then(files => files.filter(f => f.endsWith('.css')));
  
  let inlinedCss = '';
  for (const cssFile of cssFiles) {
    const cssContent = await fs.readFile(path.join(`dist-client-${mode}`, 'assets', cssFile), 'utf-8');
    
    // Minify CSS while preserving readability
    const minifiedCss = await postcss([
      cssnano({
        preset: ['default', {
          normalizeWhitespace: { exclude: false },
          discardComments: { removeAll: true },
          minifySelectors: false,
          minifyParams: false,
          mergeLonghand: false
        }]
      })
    ]).process(cssContent, { from: undefined });
    
    inlinedCss += minifiedCss.css;
  }

  // Phase 5: Create final HTML document
  console.log('Phase 5: Creating final HTML document...');
  
  // Add minimal night mode JavaScript for normal mode
  let nightModeScript = '';
  if (mode === 'normal') {
    // Extract just the night mode toggle functionality
    nightModeScript = `
      <script type="module">
        // Minimal night mode toggle implementation will be added here
        console.log('Night mode toggle loaded');
      </script>
    `;
  }

  // Add print styles for PDF mode
  const printStyles = mode === 'print' ? `
    <style>
      @media screen {
        body { 
          background: white !important;
          color: black !important;
        }
        * {
          -webkit-print-color-adjust: exact !important;
          color-adjust: exact !important;
        }
      }
    </style>
  ` : '';

  // Construct final HTML
  const finalHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="shortcut icon" href="/favicon.ico" />
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
    <link rel="manifest" href="/site.webmanifest" />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Lato:400,700&display=swap">
    <title>${head.title}</title>
    ${head.meta.map(meta => `<meta name="${meta.name}" content="${meta.content}">`).join('\n    ')}
    <style>${inlinedCss}</style>
    ${printStyles}
</head>
<body>
    ${renderedHtml}
    ${nightModeScript}
</body>
</html>`;

  // Phase 6: Write final HTML file and cleanup
  await fs.mkdir('dist', { recursive: true });
  const outputPath = `dist/resume-${mode}.html`;
  await fs.writeFile(outputPath, finalHtml, 'utf-8');
  
  // Clean up temporary build directories
  await fs.rm(`dist-ssr-${mode}`, { recursive: true, force: true });
  await fs.rm(`dist-client-${mode}`, { recursive: true, force: true });
  
  const stats = await fs.stat(outputPath);
  console.log(`✅ Generated ${outputPath} (${(stats.size / 1024).toFixed(1)}KB)`);
}

// Generate both normal and print versions
const mode = process.argv[2] || 'both';

if (mode === 'both') {
  await generateStandaloneHTML('normal');
  await generateStandaloneHTML('print');
} else {
  await generateStandaloneHTML(mode);
}