const express = require('express');
const router = express.Router();
const PengaduanController = require('../controllers/PengaduanController');
const KategoriController = require('../controllers/KategoriController');
const PeriodeController = require('../controllers/PeriodeController');

function isAuthenticated(req, res, next) {
    if (req.session.user) {
      return next();
    }
    res.redirect('/login');
}

router.use(isAuthenticated);

// ======================== ROUTE PENGADUAN ========================
// GET: Form pengaduan
router.get('/form', PengaduanController.formPengaduan);

// POST: Simpan pengaduan
router.post('/form', PengaduanController.simpanPengaduan);

// GET: Daftar pengaduan
router.get('/daftar', PengaduanController.daftarPengaduan);

// GET: Edit form pengaduan
router.get('/edit/:id', PengaduanController.showByIDPengaduan);

// POST: Update pengaduan
router.post('/edit/:id', PengaduanController.updatePengaduan);

// GET: Hapus Pengaduan (hanya jika status open)
router.get('/hapus/:id', PengaduanController.hapusPengaduan);

// ======================== ROUTE TAMBAH KATEGORI & PERIODE ========================
// POST: Tambah Kategori (AJAX)
router.post('/kategori/tambah', KategoriController.tambahKategori);

// POST: Tambah Periode (AJAX)
router.post('/periode/tambah', PeriodeController.tambahPeriode);

module.exports = router;