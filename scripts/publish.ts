import { $ } from 'bun';

async function publish() {
  // Build DLL first
  console.log('Building DLL...');
  await $`bun run build`;

  // Create dist directory and copy DLL
  console.log('Copying DLL to dist...');
  await $`mkdir -p dist/bin`;
  await $`cp build/bin/Release/template_matcher.dll dist/bin/`;

  // Then run tests
  console.log('Running tests...');
  await $`bun test`;

  // Publish to npm
  console.log('Publishing to npm...');
  await $`npm publish --access public`;
}

publish().catch(console.error);
