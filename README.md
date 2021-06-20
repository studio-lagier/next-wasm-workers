Example of integrating WASM & web workers with a Typescript NextJS project.

## Running

1. `yarn`
2. `yarn dev`
3. Open `localhost:3000`

## Layout

- Rust code is in `./rust`, generated with `wasm-pack new` and built as a part of the Next build with `wasm-pack-plugin`.
- Workers are in `./src`. Types for worker module are in `typings.d.ts`.
- wasm is imported in `wasm.worker.ts` using the Webpack 4/5 `syncWebAssembly` method.
- Workers are imported in `./pages/index.tsx` using Webpack 5's built-in Worker support.
- `next.config.js` orchestrates the necessary Webpack 5 settings, `wasm-pack-plugin`, and patches NextJS to allow wasm in workers.
