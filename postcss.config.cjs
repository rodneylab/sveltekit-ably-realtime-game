const autoprefixer = require('autoprefixer');
const postcssPresetEnv = require('postcss-preset-env');
const csso = require('postcss-csso');
const customMediaPlugin = require('postcss-custom-media');

const config = {
	plugins: [
		customMediaPlugin(),
		postcssPresetEnv({
			stage: 3,
			features: {
				'nesting-rules': true,
				'custom-media-queries': true,
				'media-query-ranges': true
			}
		}),
		autoprefixer(),
		csso()
	]
};

module.exports = config;
