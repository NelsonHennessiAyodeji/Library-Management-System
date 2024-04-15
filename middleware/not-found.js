const notFound = (req, res, next) => {
    res.status(404).json("The route that you have entered is not found on this server");
}

module.exports = notFound;
