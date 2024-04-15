const {CustomErrorAPI} = require("../error");

const errorHandler = (err, req, res, next) => {
    if(err instanceof CustomErrorAPI){
        return res.status(err.statusCode).json(err.message);
    }
    // res.status(500).json("There was an issue with the server, please try again later...");
    res.status(500).json(err.message);
}

module.exports = errorHandler;
