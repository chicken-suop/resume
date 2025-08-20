import cssnano from 'cssnano';
import fs from 'node:fs/promises';
import path from 'node:path';
import postcss from 'postcss';
import { build } from 'vite';

const CSS_MINIFY_OPTIONS = {
  prod: {
    preset: [
      'default',
      {
        discardComments: { removeAll: true },
        mergeLonghand: true,
        minifyParams: true,
        minifySelectors: true,
        normalizeWhitespace: true,
      },
    ],
  },
};

function createBuildConfig(type, isProd, useTailored) {
  const baseConfig = {
    define: {
      'import.meta.env.VITE_USE_TAILORED_RESUME': JSON.stringify(useTailored),
    },
  };

  if (type === 'ssr') {
    return {
      ...baseConfig,
      build: {
        emptyOutDir: true,
        minify: 'esbuild',
        outDir: 'dist-ssr',
        rollupOptions: {
          output: {
            entryFileNames: 'entry-server.js',
          },
        },
        sourcemap: false,
        ssr: 'src/entry-server.js',
      },
    };
  }

  return {
    ...baseConfig,
    build: {
      emptyOutDir: true,
      minify: 'esbuild',
      outDir: 'dist-client',
      rollupOptions: {
        input: 'src/entry-client.js',
        output: {
          assetFileNames: 'assets/[name].[ext]',
          entryFileNames: 'assets/app.js',
          format: 'iife',
          inlineDynamicImports: true,
        },
      },
      sourcemap: false,
      ...(isProd && {
        minify: 'terser',
        terserOptions: {
          compress: {
            drop_console: true,
            drop_debugger: true,
          },
          format: {
            comments: false,
          },
          mangle: true,
        },
      }),
    },
  };
}

async function processImages(imagePath) {
  let profile = '';
  let favicon = '';

  try {
    const sharp = (await import('sharp')).default;
    const imageBuffer = await fs.readFile(imagePath);

    const [optimizedImage, optimizedFavicon] = await Promise.all([
      sharp(imageBuffer)
        .resize(200, 200, { fit: 'cover', position: 'center' })
        .jpeg({ progressive: true, quality: 85 })
        .toBuffer(),
      sharp(imageBuffer)
        .resize(32, 32, { fit: 'cover', position: 'center' })
        .png({ quality: 90 })
        .toBuffer(),
    ]);

    profile = `data:image/jpeg;base64,${optimizedImage.toString('base64')}`;
    favicon = `data:image/png;base64,${optimizedFavicon.toString('base64')}`;
  } catch {
    // Image processing failed
  }

  return { favicon, profile };
}

async function inlineAssets(distPath, isProd) {
  const assetsDir = path.join(distPath, 'assets');
  const assetFiles = await fs.readdir(assetsDir);

  const cssFiles = assetFiles.filter(f => f.endsWith('.css'));
  const jsFiles = assetFiles.filter(f => f.endsWith('.js'));

  let css = '';
  for (const cssFile of cssFiles) {
    const cssContent = await fs.readFile(
      path.join(assetsDir, cssFile),
      'utf-8',
    );

    if (isProd) {
      const minifiedCss = await postcss([
        cssnano(CSS_MINIFY_OPTIONS.prod),
      ]).process(cssContent, { from: undefined });
      css += minifiedCss.css;
    } else {
      css += cssContent;
    }
  }

  let js = '';
  if (jsFiles.length > 0) {
    const jsFile = jsFiles[0];
    const jsContent = await fs.readFile(path.join(assetsDir, jsFile), 'utf-8');
    js = `<script type="module">${jsContent}</script>`;
  }

  return { css, js };
}

function assembleHTML(template, assets, images) {
  const { head, html } = template;
  const { css, js } = assets;
  const { favicon, profile } = images;

  let processedHtml = html;
  if (profile) {
    processedHtml = processedHtml.replace(
      /src="[^"]*picture\.jpeg[^"]*"/g,
      `src="${profile}"`,
    );
    processedHtml = processedHtml.replace(
      /&quot;\/picture\.jpeg&quot;/g,
      `&quot;${profile}&quot;`,
    );
  }

  const faviconLink = favicon
    ? `<link rel="icon" type="image/png" href="${favicon}" />`
    : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    ${faviconLink}
    <title>${head.title}</title>
    ${head.meta.map(meta => `<meta name="${meta.name}" content="${meta.content}">`).join('\n    ')}
    <style>${css}</style>
</head>
<body>
    ${processedHtml}
    ${js}
</body>
</html>`;
}

async function minifyHTML(html, isProd) {
  if (!isProd) return html;

  try {
    const { minify } = await import('html-minifier-terser');
    return await minify(html, {
      collapseBooleanAttributes: true,
      collapseWhitespace: true,
      minifyCSS: false,
      minifyJS: false,
      removeAttributeQuotes: true,
      removeComments: true,
      removeEmptyAttributes: true,
      removeRedundantAttributes: true,
    });
  } catch {
    return html;
  }
}

async function cleanup(dirs) {
  await Promise.all(
    dirs.map(dir => fs.rm(dir, { force: true, recursive: true })),
  );
}

async function generateStandaloneHTML(isProd = false) {
  const useTailored = process.env['VITE_USE_TAILORED_RESUME'] === 'true';

  await build(createBuildConfig('ssr', isProd, useTailored));
  await build(createBuildConfig('client', isProd, useTailored));

  const entryServerPath = path.resolve(
    process.cwd(),
    'dist-ssr',
    'entry-server.js',
  );
  const { render } = await import(entryServerPath);
  const { head, html } = await render();

  const images = await processImages('public/picture.jpeg');
  const assets = await inlineAssets('dist-client', isProd);

  const assembledHtml = assembleHTML({ head, html }, assets, images);
  const finalHtml = await minifyHTML(assembledHtml, isProd);

  await fs.mkdir('dist', { recursive: true });
  await fs.writeFile('dist/resume.html', finalHtml, 'utf-8');
  await cleanup(['dist-ssr', 'dist-client']);
}

// Parse command-line arguments
const args = process.argv.slice(2);
const isProd = args.includes('--prod');

await generateStandaloneHTML(isProd);
