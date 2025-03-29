    // routes/asset.js
    const express = require('express');
    const router = express.Router();
    const AssetController = require('../controllers/AssetController');

    // Gunakan multer untuk upload file
    const multer = require('multer');
    const upload = multer({ storage: multer.memoryStorage() });

    // Contoh route CRUD
    router.get('/', AssetController.getAll);      // GET all
    //router.get('/:id', AssetController.getOne);   // GET one by id
    router.get('/new', AssetController.createForm); // GET create form
    router.post('/create', upload.single('foto'), AssetController.create);     // CREATE
    router.put('/edit/:id', AssetController.update);   // UPDATE
    router.delete('/delete/:id', AssetController.delete);// DELETE

    module.exports = router;