const nsWebpack = require("@nativescript/webpack");

module.exports = (env) => {
	nsWebpack.init(env);

	const config = nsWebpack.resolveConfig();

	// Disable module concatenation to avoid circular dependency issues
	config.optimization.concatenateModules = false;

	return config;
};
