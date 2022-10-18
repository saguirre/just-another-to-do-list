module.exports = {
  i18n: {
    defaultLocale: 'en',
    locales: ['es', 'en'],
    serializeConfig: false,
    interpolation: {
      format: (value, format, lng) => {
        if (typeof value === 'number') {
          return value.toLocaleString(lng);
        }
        return value;
      },
    },
  },
};
