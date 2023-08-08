import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        laravel({
            input: [
                'resources/js/index.tsx',
            ],
            refresh: true,
        }),
        react(),
    ],

    module: {
        rules: [
          {
            test: /\.tsx?$/,
            use: 'ts-loader',
            exclude: /node_modules/,
          },
          {
            test: /\.css$/,
            use: ['style-loader', 'css-loader'],
          },
          { 
            test: /\\.(png|jp(e*)g|svg|gif|webp|avif)$/, 
            use: ['file-loader'],
          }
        ],
      },
      resolve: {
        extensions: ['.tsx', '.ts', '.js'],
      },
});