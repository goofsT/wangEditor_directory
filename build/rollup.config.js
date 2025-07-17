// rollup.config.js
import fs from 'fs';
import path from 'path';
import vue from 'rollup-plugin-vue';
import alias from '@rollup/plugin-alias';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import babel from '@rollup/plugin-babel';
import PostCSS from 'rollup-plugin-postcss';
import typescript from '@rollup/plugin-typescript';
import { terser } from 'rollup-plugin-terser';

const esbrowserslist = fs.readFileSync('./.browserslistrc')
  .toString()
  .split('\n')
  .filter((entry) => entry && entry.substring(0, 2) !== 'ie');

// Extract babel preset-env config, to combine with esbrowserslist
const babelPresetEnvConfig = require('../babel.config')
  .presets.filter((entry) => entry[0] === '@babel/preset-env')[0][1];

const projectRoot = path.resolve(__dirname, '..');

// 外部依赖
const external = ['vue'];

// 全局变量映射
const globals = {
  vue: 'Vue',
};

// 只构建 ESModule 格式
const config = {
  input: 'src/entry.esm.ts',
  external,
  output: {
    file: 'dist/wange-editor_dir_vue3.esm.js',
    format: 'esm',
    exports: 'named',
    globals,
    sourcemap: true,
    paths: {
      vue: 'vue'
    }
  },
  plugins: [
    // 路径别名解析
    alias({
      entries: [
        {
          find: '@',
          replacement: `${path.resolve(projectRoot, 'src')}`,
        },
      ],
      customResolver: resolve({
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.vue'],
      }),
    }),
    // 环境变量替换
    replace({
      'process.env.NODE_ENV': JSON.stringify('production'),
      preventAssignment: true,
      '@/': `${path.resolve(projectRoot, 'src')}/` // 替换@/前缀为实际路径
    }),
    // Vue 组件处理
    vue({
      preprocessStyles: true,
      target: 'browser'
    }),
    // 路径解析
    resolve({
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.vue'],
    }),
    // CSS 处理
    PostCSS({
      modules: {
        generateScopedName: '[local]___[hash:base64:5]',
      },
      include: /&module=.*\.css$/,
    }),
    PostCSS({ include: /(?<!&module=.*)\.css$/ }),
    // CommonJS 模块转换
    commonjs(),
    // TypeScript 处理
    typescript({
      tsconfig: './tsconfig.json',
      emitDeclarationOnly: true,
      declaration: true,
      declarationDir: 'dist/types',
      sourceMap: true,
      paths: { 
        '@/*': ['./src/*'] 
      },
      include: ['src/**/*.ts', 'src/**/*.vue'],
      exclude: ['node_modules', 'dist']
    }),
    // Babel 转换
    babel({
      exclude: 'node_modules/**',
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.vue'],
      babelHelpers: 'bundled',
      presets: [
        [
          '@babel/preset-env',
          {
            ...babelPresetEnvConfig,
            targets: esbrowserslist,
          },
        ],
      ],
    }),
    terser()
  ],
};

export default config;
