const isPlainObj = require("is-plain-obj");
const TARGET_BROWSER = "browser";

module.exports = function preset(context, opts = {}) {
  // see https://github.com/facebook/create-react-app/blob/590df7eead1a2526828aa36ceff41397e82bd4dd/packages/babel-preset-react-app/index.js#L52
  const env = process.env.BABEL_ENV || process.env.NODE_ENV;
  if (env !== "development" && env !== "test" && env !== "production") {
    throw new Error(
      "Using `@mapbox/babel-preset-mapbox` requires that you specify `NODE_ENV` or " +
        '`BABEL_ENV` environment variables. Valid values are "development", ' +
        '"test", and "production". Instead, received: ' +
        JSON.stringify(env) +
        "."
    );
  }

  opts = isPlainObj(opts) ? opts : {};

  var isEnvDevelopment = env === "development";
  var isEnvProduction = env === "production";
  var isEnvTest = env === "test";

  const target = opts.target || TARGET_BROWSER;

  const presets = [
    [require.resolve("babel-preset-env"), opts.env],
    require.resolve("babel-preset-react")
  ];

  const plugins = [
    require.resolve("babel-plugin-syntax-dynamic-import"),
    require.resolve("babel-plugin-transform-class-properties"),
    require.resolve("babel-plugin-transform-object-rest-spread"),
    [
      require.resolve("@mapbox/babel-plugin-transform-jsxtreme-markdown"),
      opts.jsxtremeMarkdownOptions
    ]
  ];

  if (isEnvProduction) {
    plugins.push("babel-plugin-transform-react-remove-prop-types");
  } else {
    plugins.push(require.resolve("babel-plugin-transform-react-jsx-source"));
    plugins.push(require.resolve("babel-plugin-transform-react-jsx-self"));
  }

  return {
    plugins,
    presets
  };
};
