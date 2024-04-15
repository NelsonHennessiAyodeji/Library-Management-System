const BadRequestError = require('./BadRequestError');
const CustomErrorAPI = require('./CustomErrorAPI');
const NotAcceptableError = require('./NotAcceptableError');
const NotFoundError = require('./NotFoundError');
const UnauthenticatedError = require('./UnauthenticatedError');
const UnauthorizedError = require('./UnauthorizedError')

module.exports = {
    BadRequestError,
    CustomErrorAPI,
    NotAcceptableError,
    NotFoundError,
    UnauthenticatedError,
    UnauthorizedError
};