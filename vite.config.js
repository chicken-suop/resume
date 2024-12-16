import { defineConfig } from 'vite';

export default defineConfig(({ mode }) => {
  const base = mode === 'development' ? '/' : '/resume/';

  return {
    base,
    build: {
      // Ensure assets are placed in a predictable location
      assetsDir: 'assets',
      // Generate a manifest for better asset tracking
      manifest: true,
      rollupOptions: {
        output: {
          assetFileNames: `assets/[name]-[hash].[ext]`,
          chunkFileNames: `assets/[name]-[hash].js`,
          // Ensure consistent chunk names
          entryFileNames: `assets/[name]-[hash].js`,
        },
      },
    },
    define: {
      'import.meta.env.VITE_USE_TAILORED_RESUME': JSON.stringify(
        process.env['VITE_USE_TAILORED_RESUME'] ? true : false,
      ),
    },
    esbuild: {
      supported: {
        'top-level-await': true,
      },
    },
    server: {
      host: '0.0.0.0',
      port: Number(process.env['PORT'] ?? '3000'),
    },
  };
});
