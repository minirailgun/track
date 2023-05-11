import path from 'path'
import ts from 'rollup-plugin-typescript2'
import dts from 'rollup-plugin-dts'
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default [
  {
    input: "./src/core/index.ts",
    output: [
      // es => import export
      {
        file: path.resolve(__dirname, './dist/index.esm.js'),
        format: "es"
      },
      // cjs => require exports
      {
        file: path.resolve(__dirname, './dist/index.cjs.js'),
        format: "cjs"
      },
      // umd => AMD CMD global
      {
        file: path.resolve(__dirname, './dist/index.js'),
        format: "umd",
        name: "tracker"
      }
    ],
    plugins: [
      ts()
    ]
  },
  {
    input: "./src/core/index.ts",
    output: {
      file: path.resolve(__dirname, './dist/index.d.ts'),
      format: "es"
    },
    plugins: [
      dts()
    ]
  }
]