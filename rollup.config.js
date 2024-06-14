import { babel } from "@rollup/plugin-babel";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import terser from "@rollup/plugin-terser";
import dts from "rollup-plugin-dts";
import del from "rollup-plugin-delete";
import postcss from "rollup-plugin-postcss";
import preserveDirectives from "rollup-preserve-directives";

export default [
  {
    input: "src/index.ts",
    output: [
      {
        file: "dist/index.min.js",
        format: "es",
      },
    ],
    external: ["react", "react-hook-form"],
    plugins: [
      preserveDirectives(),
      resolve({
        extensions: [".js", ".jsx", ".ts", ".tsx"],
      }), // Resolve node_modules dependencies
      commonjs(), // Convert CommonJS modules to ES6
      typescript({ tsconfig: "./tsconfig.json" }),
      postcss({
        modules: true,
        extract: "style.min.css",
        minimize: true,
      }),
      babel({
        babelHelpers: "bundled",
        exclude: "node_modules/**",
        presets: ["@babel/preset-react"],
        extensions: [".js", ".jsx", ".ts", ".tsx"],
      }),
      terser(),
    ],
  },
  {
    input: "dist/dts/index.d.ts",
    output: [{ file: "dist/index.d.ts", format: "es" }],
    external: [/\.css$/],
    plugins: [
      dts(),
      del({ targets: "dist/dts", hook: "buildEnd" }), // Clean up dts folder after build
    ],
  },
];
