// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

config.resolver.sourceExts = ["mjs", "js", "jsx", "json", "ts", "tsx", "cjs"];
config.resolver.requireCycleIgnorePatterns = [/(^|\/|\\)node_modules($|\/|\\)/];

module.exports = withNativeWind(config, { input: "./global.css" });
