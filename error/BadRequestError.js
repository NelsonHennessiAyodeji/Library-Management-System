const CustomErrorAPI = require('./CustomErrorAPI');
const {StatusCodes} = require('http-status-codes');

class BadRequestError extends CustomErrorAPI{
    constructor(message){
        super(message);
        this.statusCode = StatusCodes.BAD_REQUEST;
    }
}

module.exports = BadRequestError;