const path = require('path')

module.exports = {
  i18n: {
    defaultLocale: 'en',
    locales: ['es', 'en'],
    localePath: path.resolve('./public/locales'),
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
