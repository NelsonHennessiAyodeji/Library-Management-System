const CustomErrorAPI = require("./CustomErrorAPI");
const { StatusCodes } = require("http-status-codes");

class NotAcceptableError extends CustomErrorAPI{
    constructor(message){
        super(message);
        this.statusCode = StatusCodes.NOT_ACCEPTABLE;
    }
}

module.exports = NotAcceptableError;