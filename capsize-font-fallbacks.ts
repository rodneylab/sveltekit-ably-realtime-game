import { createFontStack } from '@capsizecss/core';
import arial from '@capsizecss/metrics/arial';
import roboto from '@capsizecss/metrics/roboto';
import courierNew from '@capsizecss/metrics/courierNew';
import spaceMono from '@capsizecss/metrics/spaceMono';
import spaceGrotesk from '@capsizecss/metrics/spaceGrotesk';
import { writeFileSync } from 'node:fs';
import path from 'node:path';

const __dirname = path.resolve();
const outputPath = path.join(__dirname, 'src/lib/styles/font-fallbacks.css');

const { fontFaces: fontFacesBody, fontFamily: fontFamilyBody } = createFontStack([
	spaceMono,
	courierNew,
	roboto
]);
const { fontFaces: fontFacesHeading, fontFamily: fontFamilyHeading } = createFontStack([
	spaceGrotesk,
	arial,
	roboto
]);

const css = `/* This file is generated using capsize. Run \`vite-node capsize-font-fallbacks.ts\` to refresh. */

:root {
  --font-body: ${fontFamilyBody}, monospace;
  --font-heading: ${fontFamilyHeading}, sans-serif;
}

${fontFacesBody}
${fontFacesHeading}`;

writeFileSync(outputPath, css);
