const express = require('express');
const router = express.Router();
const {
    getAllBooks,
    getSingleBooks,
    createBook,
    updateBook,
    deleteBook,
    uploadBook
} = require('../controllers/bookController');
const { authenticateUser, authorizePermissions } = require('../middleware/authentication');

router.route('/').get(getAllBooks).post(authenticateUser, authorizePermissions('admin'), createBook);
router.route('/upload').post(authenticateUser, authorizePermissions('admin'), uploadBook);
router.route('/:id').get(getSingleBooks).put(authenticateUser, authorizePermissions('admin'), updateBook).delete(authenticateUser, authorizePermissions('admin'), deleteBook);

module.exports = router;