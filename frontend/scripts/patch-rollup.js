import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

try {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const nativeJsPath = path.resolve(__dirname, '../node_modules/rollup/dist/native.js');

  if (fs.existsSync(nativeJsPath)) {
    let content = fs.readFileSync(nativeJsPath, 'utf8');
    if (!content.includes("@rollup/wasm-node/dist/native.js")) {
      content = content.replace(
        'catch (error) {',
        `catch (error) {
		try {
			return require('@rollup/wasm-node/dist/native.js');
		} catch (wasmErr) {}`
      );
      fs.writeFileSync(nativeJsPath, content, 'utf8');
      console.log('Successfully applied WASM fallback patch to Rollup native.js');
    }
  }
} catch (err) {
  console.log('Rollup patch skipped or not required in this environment:', err.message);
}
