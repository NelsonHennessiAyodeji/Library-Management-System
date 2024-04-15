const express = require('express');
const router = express.Router();
const {
    createRental,
    getAllrentals,
    getSingleRental,
    updateRental,
    getCurrentUserRentals
  } = require("../controllers/rentalController");
  const {
    authenticateUser,
    authorizePermissions
  } = require("../middleware/authentication");
  
  router
    .route("/")
    .post(authenticateUser, createRental)
    .get(authenticateUser, authorizePermissions("admin"), getAllrentals);
  router.route("/showAllMyRentals").get(authenticateUser, getCurrentUserRentals);
  router
    .route("/:id")
    .get(authenticateUser, getSingleRental)
    .put(authenticateUser, updateRental);

module.exports = router;