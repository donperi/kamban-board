const HttpStatus = require('http-status-codes');
const moment = require('moment');
const ObjectId = require('mongoose').Types.ObjectId;

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

const filterMapper = (filters, mapper = {}) => {
  return Object.keys(filters).reduce((carry, key) => {
    if (filters[key] === undefined) {
      return carry;
    }

    if (filters[key] === 'null') {
      carry[key] = null;
      return carry;
    }

    if (mapper[key]) {
      carry[key] = mapper[key](filters[key]);
      return carry
    }

    carry[key] = filters[key] === "null" ? null : filters[key];

    return carry;
  }, {});
};

const filterUndefinedValues  = (obj) => {
  Object.keys(obj).forEach(function (key) {
    if(obj[key] === undefined){
      delete obj[key];
    }
  });

  return obj;
};

const objectIdSanitizer = value => {
  if (value === undefined) { return; }
  if (value === "null") { return null; }
  if (!value || !ObjectId.isValid(value)) { return new ObjectId(); }

  return value;
};

const nullStringSanitizer = value => value || null;

const dateSanitizer  = value => {
  if (value === 'null' || !value) { return value; }
  return moment(value).toDate();
};


module.exports = {
  appResponse,
  filterMapper,
  filterUndefinedValues,
  objectIdSanitizer,
  dateSanitizer,
  nullStringSanitizer
};
