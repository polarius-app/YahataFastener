const express = require('express');
const router = express.Router();
const adminController = require('../controllers/AdminController');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() }); // Middleware untuk upload foto

function isAuthenticated(req, res, next) {
    if (req.session.user) {
      return next();
    }
    res.redirect('/login');
}

router.use(isAuthenticated);

router.get('/admin/users', adminController.showUser);
router.get('/admin/dashboard', adminController.showDashboard);
router.get('/admin/users/create', adminController.showCreateUserForm);
router.post('/admin/users/create', upload.single('foto'), adminController.createUser);
router.get('/admin/users/edit/:id', adminController.showEditUserForm);
router.post('/admin/users/edit/:id', upload.single('foto'), adminController.editUser);
router.post('/admin/users/delete/:id', adminController.deleteUser);
router.post('/admin/toggle-status/:id', adminController.toggleUserStatus);

module.exports = router;