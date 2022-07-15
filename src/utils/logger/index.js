import logger from 'pino'

const browserLogger = logger({
    browser: {
        serialize: true,
      write: {
        info: function (o) {
          console.log(o)
        },
        error: function (o) {
          //process error log object
        }
      }
    }
});

export default browserLogger;