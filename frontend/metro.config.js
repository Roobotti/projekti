const { getDefaultConfig } = require("@expo/metro-config");

const defaultConfig = getDefaultConfig(__dirname);

defaultConfig.resolver.sourceExts.push("cjs");

// Check if 'vectorDrawables' object exists, if not, create it
if (!defaultConfig.resolver.vectorDrawables) {
  defaultConfig.resolver.vectorDrawables = {};
}

// Set 'useSupportLibrary' property to true
defaultConfig.resolver.vectorDrawables.useSupportLibrary = true;

module.exports = defaultConfig;
