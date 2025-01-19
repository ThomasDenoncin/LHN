module.exports = {
  extends: ["plugin:astro/recommended"],
  plugins: [],
  overrides: [
    {
      files: ["*.astro"],
      parser: "astro-eslint-parser",
      rules: {
        "valid-jsdoc": [
          "error",
          {
            requireReturn: false,
            requireParamType: true,
            requireReturnType: true,
          },
        ],
      },
    },
  ],
};
