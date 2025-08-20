import fs from 'node:fs/promises';
import path from 'node:path';
import { build } from 'vite';
import cssnano from 'cssnano';
import postcss from 'postcss';

async function generateStandaloneHTML(isProd = false) {
  console.log(`Building HTML${isProd ? ' [PRODUCTION]' : ''}...`);

  const useTailoredResume = process.env['VITE_USE_TAILORED_RESUME'] === 'true';

  // Phase 1: Build the SSR server bundle
  console.log('Phase 1: Building SSR server bundle...');
  await build({
    define: {
      'import.meta.env.VITE_USE_TAILORED_RESUME':
        JSON.stringify(useTailoredResume),
    },
    build: {
      outDir: 'dist-ssr',
      emptyOutDir: true,
      ssr: 'src/entry-server.js',
      minify: 'esbuild',
      sourcemap: false,
      rollupOptions: {
        output: {
          entryFileNames: 'entry-server.js',
        },
      },
    },
  });

  // Phase 2: Build client assets for CSS and JS extraction
  console.log('Phase 2: Building client assets...');
  await build({
    define: {
      'import.meta.env.VITE_USE_TAILORED_RESUME':
        JSON.stringify(useTailoredResume),
    },
    build: {
      outDir: 'dist-client',
      emptyOutDir: true,
      minify: 'esbuild',
      sourcemap: false,
      rollupOptions: {
        input: 'src/entry-client.js', // Single entry that includes CSS + JS
        output: {
          format: 'iife', // Self-contained function (no module imports)
          entryFileNames: 'assets/app.js',
          assetFileNames: 'assets/[name].[ext]',
          inlineDynamicImports: true, // Bundle all dependencies inline
        },
      },
      ...(isProd && {
        minify: 'terser',
        terserOptions: {
          compress: {
            drop_console: true,
            drop_debugger: true,
          },
          mangle: true,
          format: {
            comments: false,
          },
        },
      }),
    },
  });

  // Phase 3: Execute the bundled SSR code
  console.log('Phase 3: Executing SSR to generate HTML...');

  const entryServerPath = path.resolve(
    process.cwd(),
    'dist-ssr',
    'entry-server.js',
  );
  const { render } = await import(entryServerPath);

  // First pass to get basic HTML - we'll optimize images after
  const { html: renderedHtml, head } = await render();

  // Phase 4: Optimize and inline assets
  console.log('Phase 4: Optimizing assets...');

  let optimizedImageDataUri = '';
  let optimizedFaviconDataUri = '';

  try {
    // Optimize profile image
    const sharp = (await import('sharp')).default;
    const imageBuffer = await fs.readFile('public/picture.jpeg');
    const optimizedImage = await sharp(imageBuffer)
      .resize(200, 200, { fit: 'cover', position: 'center' })
      .jpeg({ quality: 85, progressive: true })
      .toBuffer();
    optimizedImageDataUri = `data:image/jpeg;base64,${optimizedImage.toString('base64')}`;
    console.log(
      `  ✓ Profile image optimized: ${imageBuffer.length} → ${optimizedImage.length} bytes`,
    );
  } catch (error) {
    console.warn('  ⚠ Profile image optimization failed:', error.message);
  }

  try {
    // Create optimized favicon from profile image
    const sharp = (await import('sharp')).default;
    const imageBuffer = await fs.readFile('public/picture.jpeg');
    const optimizedFavicon = await sharp(imageBuffer)
      .resize(32, 32, { fit: 'cover', position: 'center' })
      .png({ quality: 90 })
      .toBuffer();
    optimizedFaviconDataUri = `data:image/png;base64,${optimizedFavicon.toString('base64')}`;
    console.log(
      `  ✓ Favicon created from profile image: ${optimizedFavicon.length} bytes`,
    );
  } catch (error) {
    console.warn('  ⚠ Favicon creation failed:', error.message);
  }

  // Phase 5: Extract and inline CSS and JavaScript
  console.log('Phase 5: Inlining CSS and JavaScript...');
  const assetsDir = path.join('dist-client', 'assets');
  const assetFiles = await fs.readdir(assetsDir);

  const cssFiles = assetFiles.filter(f => f.endsWith('.css'));
  const jsFiles = assetFiles.filter(f => f.endsWith('.js'));

  let inlinedCss = '';
  for (const cssFile of cssFiles) {
    const cssContent = await fs.readFile(
      path.join(assetsDir, cssFile),
      'utf-8',
    );

    // Minify CSS with prod/dev settings
    const cssMinifyOptions = isProd
      ? {
          preset: [
            'default',
            {
              discardComments: { removeAll: true },
              normalizeWhitespace: true,
              minifySelectors: true,
              minifyParams: true,
              mergeLonghand: true,
            },
          ],
        }
      : {
          preset: [
            'default',
            {
              normalizeWhitespace: { exclude: false },
              discardComments: { removeAll: true },
              minifySelectors: false,
              minifyParams: false,
              mergeLonghand: false,
            },
          ],
        };

    const minifiedCss = await postcss([cssnano(cssMinifyOptions)]).process(
      cssContent,
      { from: undefined },
    );

    inlinedCss += minifiedCss.css;
  }

  // Extract client-side JavaScript bundle
  let clientScript = '';
  if (jsFiles.length > 0) {
    const jsFile = jsFiles[0]; // Should be app.js
    const jsContent = await fs.readFile(path.join(assetsDir, jsFile), 'utf-8');
    clientScript = `<script type="module">${jsContent}</script>`;
  }

  // Phase 6: Create final HTML document
  console.log('Phase 6: Creating final HTML document...');


  // Replace image references with optimized data URI in rendered HTML
  let processedHtml = renderedHtml;
  if (optimizedImageDataUri) {
    // Replace src attributes
    processedHtml = processedHtml.replace(
      /src="[^"]*picture\.jpeg[^"]*"/g,
      `src="${optimizedImageDataUri}"`,
    );
    // Replace JSON data attributes (optional cleanup)
    processedHtml = processedHtml.replace(
      /&quot;\/picture\.jpeg&quot;/g,
      `&quot;${optimizedImageDataUri}&quot;`,
    );
  }

  // Build favicon link
  const faviconLink = optimizedFaviconDataUri
    ? `<link rel="icon" type="image/png" href="${optimizedFaviconDataUri}" />`
    : '';

  // Construct final HTML
  let finalHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    ${faviconLink}
    <title>${head.title}</title>
    ${head.meta.map(meta => `<meta name="${meta.name}" content="${meta.content}">`).join('\n    ')}
    <style>${inlinedCss}</style>
</head>
<body>
    ${processedHtml}
    ${clientScript}
</body>
</html>`;

  // HTML minification for production builds
  if (isProd) {
    try {
      const { minify } = await import('html-minifier-terser');
      finalHtml = await minify(finalHtml, {
        collapseWhitespace: true,
        removeComments: true,
        removeAttributeQuotes: true,
        removeRedundantAttributes: true,
        collapseBooleanAttributes: true,
        removeEmptyAttributes: true,
        // DO NOT re-minify embedded content (already optimized by terser/cssnano)
        minifyCSS: false,
        minifyJS: false,
      });
      console.log('  ✓ HTML structure minified');
    } catch (error) {
      console.warn('  ⚠ HTML minification failed:', error.message);
    }
  }

  // Phase 7: Write final HTML file and cleanup
  await fs.mkdir('dist', { recursive: true });
  const outputPath = 'dist/resume.html';
  await fs.writeFile(outputPath, finalHtml, 'utf-8');

  // Clean up temporary build directories
  await fs.rm('dist-ssr', { recursive: true, force: true });
  await fs.rm('dist-client', { recursive: true, force: true });

  const stats = await fs.stat(outputPath);
  console.log(
    `✅ Generated ${outputPath} (${(stats.size / 1024).toFixed(1)}KB)${isProd ? ' [PRODUCTION]' : ''}`,
  );
}

// Parse command-line arguments
const args = process.argv.slice(2);
const isProd = args.includes('--prod');

if (isProd) {
  console.log('🚀 Production mode enabled - aggressive minification');
}

await generateStandaloneHTML(isProd);
