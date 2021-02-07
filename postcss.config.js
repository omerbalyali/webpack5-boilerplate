const autoprefixer = require('autoprefixer');
const pluginImport = require('postcss-import');
const pluginNested = require('postcss-nested');

module.exports = {
  plugins: [autoprefixer, pluginImport(), pluginNested],
};
