const express = require('express');
const router = express();
const {
    authenticateUser,
    authorizePermissions
} = require('../middleware/authentication');
const {
    getAllUsers,
    getSingleUser,
    showCurrentUser,
    updateUser,
    updateUserPassword,
    addBookToList,
    getBookList
} = require('../controllers/userController');

router.route('/').get(authenticateUser, authorizePermissions('admin'), getAllUsers);
router.route('/showMe').get(authenticateUser, showCurrentUser);
router.route('/updateUser').put(authenticateUser, authorizePermissions('admin'), updateUser);
router.route('/updateUserPassword').put(authenticateUser, updateUserPassword);
router.route('/list/').get(authenticateUser, getAllUsers);
router.route('/list/:id').post(authenticateUser, addBookToList);
router.route('/:id').post(authenticateUser, getSingleUser);

module.exports = router;