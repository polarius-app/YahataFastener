    // routes/asset.js
    const express = require('express');
    const router = express.Router();
    const AssetController = require('../controllers/AssetController');
    const DepartemenController = require('../controllers/DepartemenController');
    const MerkController = require('../controllers/MerkController');
    const TipeMerkController = require('../controllers/TipeMerkController');

    // Gunakan multer untuk upload file
    const multer = require('multer');
    //const upload = multer({ storage: multer.memoryStorage() });

    const upload = multer({
        storage: multer.memoryStorage(),
        limits: {
          fieldSize: 25 * 1024 * 1024, // izinkan hingga 25 MB per field
          fileSize: 25 * 1024 * 1024   // jika diperlukan untuk file upload
        }
    }).fields([
        { name: 'foto', maxCount: 1 }, // untuk foto
        { name: 'pic_microtik', maxCount: 1 } // untuk dokumen (jika ada)

    ]);
      

    // Contoh route CRUD
    router.get('/', AssetController.getAll);      // GET all
    //router.get('/:id', AssetController.getOne);   // GET one by id
    router.get('/new', AssetController.createForm); // GET create form
    router.post('/create', upload, AssetController.create);     // CREATE
    router.put('/edit/:id', AssetController.update);   // UPDATE
    router.delete('/delete/:id', AssetController.delete);// DELETE

    router.post('/departemen/tambah', DepartemenController.tambahDepartemen); // Tambah Departemen (AJAX)
    router.post('/merek/tambah', MerkController.tambahMerk); // Tambah Departemen (AJAX)
    router.post('/tipe-merek/tambah', TipeMerkController.tambahTipeMerk); // Tambah Tipe Merek (AJAX)

    module.exports = router;