module.exports = {
		presets: [
			["babel-preset-expo", { jsxImportSource: "nativewind" }],
			"nativewind/babel",
		],
		plugins: [
			[
				'module:react-native-dotenv', 
				{
					envName: "APP_ENV",
					moduleName: "@env",
					path: ".env",
				}
			]
		]
};
