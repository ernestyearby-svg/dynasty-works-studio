import fs from 'node:fs';
import path from 'node:path';

const deployId = process.env.DEPLOY_ID || process.env.DEPLOY_URL || 'staging-preview';
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
