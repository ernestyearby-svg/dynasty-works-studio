import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

let currentBranch = '';
try {
  currentBranch = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf-8' }).trim();
} catch {}

let existingDeployId = '6abf622c2ba893fc1cd64da0';
try {
  const current = fs.readFileSync(path.resolve('netlify/functions/lib/build-info.ts'), 'utf8');
  const m = current.match(/deployId:\s*"([a-f0-9]{24})"/i);
  if (m && m[1]) {
    existingDeployId = m[1];
  }
} catch {}

const deployId = process.env.DEPLOY_ID || existingDeployId;

// Explicitly set context: staging/growth-os-launch is deploy-preview
let context = process.env.CONTEXT || 'deploy-preview';
if (currentBranch.startsWith('staging')) {
  context = 'deploy-preview';
}

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

