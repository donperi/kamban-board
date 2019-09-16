const HttpStatus = require('http-status-codes');

const appResponse = (res, data, status = HttpStatus.OK, message = null) => {
  if (!message) {
    message = HttpStatus.getStatusText(status);
  }

  res
    .status(status)
    .json( {
      message: message,
      error: status >= 400,
      status,
      data
    });
};

module.exports = {
  appResponse
};
