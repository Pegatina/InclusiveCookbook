import { defineConfig } from 'vite';
import path from 'path';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
  root: './',

  plugins: [
    // Se copia toda la carpeta assets a dist/assets
    viteStaticCopy({
      targets: [
        {
          src: 'assets',
          dest: '',  
        },
      ],
    }),
  ],

  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      input: {
        index: path.resolve(__dirname, 'index.html'),
        recipe: path.resolve(__dirname, 'src/pages/recipe.html'),
        main: path.resolve(__dirname, 'src/pages/main.html'),
      },
      output: {
        entryFileNames: 'js/[name].js',
        chunkFileNames: 'js/[name].js',
        assetFileNames: ({ name }) => {
          if (!name) return 'assets/[name].[ext]';

          if (name.endsWith('.css')) return 'assets/css/[name].[ext]';
          if (/\.(png|jpe?g|svg|gif)$/.test(name)) return 'assets/images/[name].[ext]';

          return 'assets/[name].[ext]';
        },
      },
    },
  },

  publicDir: 'public',

  resolve: {
    alias: {
      '@js': path.resolve(__dirname, 'src/js'),
      '@data': path.resolve(__dirname, 'src/data'),
      '@pages': path.resolve(__dirname, 'src/pages'),
      '@assets': path.resolve(__dirname, 'assets'),
    },
  },

  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@assets/css/style.scss";`,
      },
    },
  },

  assetsInclude: ['**/*.json', '**/*.png', '**/*.jpg', '**/*.svg'],

  optimizeDeps: {
    include: ['@js/main.js', '@js/recipes.js', '@js/utils.js'],
  },
});
