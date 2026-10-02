import fs from 'node:fs';
import path from 'node:path';

let existingDeployId = '6abf5eb3527856ed98f3f12b';
try {
  const current = fs.readFileSync(path.resolve('netlify/functions/lib/build-info.ts'), 'utf8');
  const m = current.match(/deployId:\s*"([a-f0-9]{24})"/i);
  if (m && m[1]) {
    existingDeployId = m[1];
  }
} catch {}

const deployId = process.env.DEPLOY_ID || existingDeployId;
const context = process.env.CONTEXT || 'deploy-preview';
const commitRef = process.env.COMMIT_REF || '';

const content = `// Auto-generated during build by scripts/generate-build-info.mjs
export const BUILD_INFO = {
  deployId: ${JSON.stringify(deployId)},
  context: ${JSON.stringify(context)},
  commitRef: ${JSON.stringify(commitRef)},
  builtAt: ${JSON.stringify(new Date().toISOString())},
};
`;

fs.writeFileSync(path.resolve('netlify/functions/lib/build-info.ts'), content, 'utf8');
console.log(`[generate-build-info] Wrote build info: deployId=${deployId}, context=${context}`);

