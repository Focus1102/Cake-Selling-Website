module.exports = {
  transpileDependencies: ["vuetify"],
  devServer: {
    port: 8080,
    host: 'localhost', // Corrected typo here
  },
};
process.env.VUE_APP_FEATURE_FLAGS = {
  __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: true,
};

process.env.__VUE_OPTIONS_API__ = true;
process.env.__VUE_PROD_DEVTOOLS__ = false;
