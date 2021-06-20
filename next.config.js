const WasmPackPlugin = require('@wasm-tool/wasm-pack-plugin');
const SSRPlugin =
  require('next/dist/build/webpack/plugins/nextjs-ssr-import').default;
const {
  dirname,
  relative,
  resolve,
  join,
} = require('path');

module.exports = {
  webpack(config) {
    // Ensures that web workers can import scripts.
    config.output.publicPath = '/_next/';

    // From https://github.com/rustwasm/wasm-pack/issues/835#issuecomment-772591665
    config.experiments = {
      syncWebAssembly: true,
    };

    config.module.rules.push({
      test: /\.wasm$/,
      type: 'webassembly/sync',
    });

    // From https://github.com/wasm-tool/wasm-pack-plugin
    config.plugins.push(
      new WasmPackPlugin({
        crateDirectory: resolve('./rust'),
        args: '--log-level warn',
      })
    );

    // From https://github.com/vercel/next.js/issues/22581#issuecomment-864476385
    const ssrPlugin = config.plugins.find(
      (plugin) => plugin instanceof SSRPlugin
    );

    if (ssrPlugin) {
      patchSsrPlugin(ssrPlugin);
    }

    return config;
  },
};

// Patch the NextJsSSRImport plugin to not throw with WASM generated chunks.
function patchSsrPlugin(plugin) {
  plugin.apply = function apply(compiler) {
    compiler.hooks.compilation.tap(
      'NextJsSSRImport',
      (compilation) => {
        compilation.mainTemplate.hooks.requireEnsure.tap(
          'NextJsSSRImport',
          (code, chunk) => {
            // The patch that we need to ensure this plugin doesn't throw
            // with WASM chunks.
            if (!chunk.name) {
              return;
            }

            // Update to load chunks from our custom chunks directory
            const outputPath = resolve('/');
            const pagePath = join('/', dirname(chunk.name));
            const relativePathToBaseDir = relative(
              pagePath,
              outputPath
            );
            // Make sure even in windows, the path looks like in unix
            // Node.js require system will convert it accordingly
            const relativePathToBaseDirNormalized =
              relativePathToBaseDir.replace(/\\/g, '/');
            return code
              .replace(
                'require("./"',
                `require("${relativePathToBaseDirNormalized}/"`
              )
              .replace(
                'readFile(join(__dirname',
                `readFile(join(__dirname, "${relativePathToBaseDirNormalized}"`
              );
          }
        );
      }
    );
  };
}
