import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

try {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  // 1. WASM patch for Rollup on Windows
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

  // 2. Ensure all CLI binaries in node_modules/.bin have executable permissions on Linux
  const binDir = path.resolve(__dirname, '../node_modules/.bin');
  if (fs.existsSync(binDir)) {
    for (const binFile of fs.readdirSync(binDir)) {
      try {
        fs.chmodSync(path.join(binDir, binFile), 0o755);
      } catch (chmodErr) {}
    }
  }
} catch (err) {
  console.log('Rollup patch skipped or not required in this environment:', err.message);
}
