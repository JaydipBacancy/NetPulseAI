/* eslint-disable @typescript-eslint/no-require-imports */

const fs = require("node:fs");
const path = require("node:path");

const runtimeReplacement =
  '{let t=tb.workUnitAsyncStorage.getStore();if(!t)return nq.set(e,i),i;if("prerender-client"===t.type){let t=new Promise(e=>{process.nextTick(()=>{e(i)})});return nq.set(e,t),t}}';

const runtimePattern =
  /\{let t=tb\.workUnitAsyncStorage\.getStore\(\);if\(!t\)throw Object\.defineProperty\(new [A-Za-z$][\w$]*\.z\("Expected workUnitAsyncStorage to have a store\."\),"__NEXT_ERROR_CODE",\{value:"E696",enumerable:!1,configurable:!0\}\);if\("prerender-client"===t\.type\)\{let t=new Promise\(e=>\{process\.nextTick\(\(\)=>\{e\(i\)\}\)\}\);return nq\.set\(e,t\),t\}\}/g;

const sourcePatches = [
  {
    relativePath: "node_modules/next/dist/server/app-render/use-flight-response.js",
    pattern:
      /const workUnitStore = _workunitasyncstorageexternal\.workUnitAsyncStorage\.getStore\(\);\s*if \(!workUnitStore\) \{\s*throw Object\.defineProperty\(new _invarianterror\.InvariantError\('Expected workUnitAsyncStorage to have a store\.'\), "__NEXT_ERROR_CODE", \{\s*value: "E696",\s*enumerable: false,\s*configurable: true\s*\}\);\s*\}/m,
    replacement:
      "const workUnitStore = _workunitasyncstorageexternal.workUnitAsyncStorage.getStore();\n        if (!workUnitStore) {\n            flightResponses.set(flightStream, newResponse);\n            return newResponse;\n        }",
  },
  {
    relativePath: "node_modules/next/dist/esm/server/app-render/use-flight-response.js",
    pattern:
      /const workUnitStore = workUnitAsyncStorage\.getStore\(\);\s*if \(!workUnitStore\) \{\s*throw Object\.defineProperty\(new InvariantError\('Expected workUnitAsyncStorage to have a store\.'\), "__NEXT_ERROR_CODE", \{\s*value: "E696",\s*enumerable: false,\s*configurable: true\s*\}\);\s*\}/m,
    replacement:
      "const workUnitStore = workUnitAsyncStorage.getStore();\n        if (!workUnitStore) {\n            flightResponses.set(flightStream, newResponse);\n            return newResponse;\n        }",
  },
];

const runtimeFiles = [
  "node_modules/next/dist/compiled/next-server/app-page.runtime.prod.js",
  "node_modules/next/dist/compiled/next-server/app-page-experimental.runtime.prod.js",
  "node_modules/next/dist/compiled/next-server/app-page-turbo.runtime.prod.js",
  "node_modules/next/dist/compiled/next-server/app-page-turbo-experimental.runtime.prod.js",
];

let patchedFiles = 0;

for (const relativePath of runtimeFiles) {
  const absolutePath = path.join(process.cwd(), relativePath);

  if (!fs.existsSync(absolutePath)) {
    continue;
  }

  const current = fs.readFileSync(absolutePath, "utf8");

  if (current.includes(runtimeReplacement)) {
    continue;
  }

  const next = current.replace(runtimePattern, runtimeReplacement);

  if (next === current) {
    continue;
  }

  fs.writeFileSync(absolutePath, next);
  patchedFiles += 1;
  console.log(`[next-hotfix] patched ${relativePath}`);
}

for (const patch of sourcePatches) {
  const absolutePath = path.join(process.cwd(), patch.relativePath);

  if (!fs.existsSync(absolutePath)) {
    continue;
  }

  const current = fs.readFileSync(absolutePath, "utf8");

  if (current.includes(patch.replacement)) {
    continue;
  }

  const next = current.replace(patch.pattern, patch.replacement);

  if (next === current) {
    continue;
  }

  fs.writeFileSync(absolutePath, next);
  patchedFiles += 1;
  console.log(`[next-hotfix] patched ${patch.relativePath}`);
}

if (patchedFiles === 0) {
  console.log("[next-hotfix] already applied");
}
