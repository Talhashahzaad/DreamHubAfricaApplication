// module.exports = function (api) {
//   api.cache(true);
//   return {
//     presets: [
//       ["babel-preset-expo", { jsxImportSource: "nativewind" }],
//       "nativewind/babel",
//     ],
//      plugins: [
//       ["module:react-native-dotenv", {
//         "moduleName": "@env",
//         "path": ".env",
//       }]
//      ]
//   };
// };

// module.exports = function (api) {
//   api.cache(true);
//   return {
//     presets: [
//       ["babel-preset-expo", {
//         jsxImportSource: "nativewind"
//       }], "nativewind/babel",
//     ],
//   };
// };

module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      [
        "babel-preset-expo",
        {
          jsxImportSource: "nativewind",
        },
      ],
      "nativewind/babel",
    ],
    plugins: [
      // 👇 Needed for expo-router
      require.resolve("expo-router/babel"),

      // 👇 Updated plugin (moved from reanimated to worklets)
      "react-native-worklets/plugin",
    ],
  };
};
