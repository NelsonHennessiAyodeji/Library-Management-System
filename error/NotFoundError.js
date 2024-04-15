const CustomErrorAPI = require('./CustomErrorAPI');
const {StatusCodes} = require('http-status-codes');

class NotFoundError extends CustomErrorAPI{
    constructor(message){
        super(message);
        this.statusCode = StatusCodes.NOT_FOUND;
    }
}

module.exports = NotFoundError;
