const log4js = require('log4js');
log4js.configure({
  appenders: {
    console: { type: 'console' },
    file: { type: 'file', filename: './logs/logs.log' },
  },
  categories: {
    default: { appenders: ['file', 'console'], level: 'trace' },
  },
});

module.exports = log4js.getLogger();
