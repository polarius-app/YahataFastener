const { KategoriMasalah } = require('../models');

exports.tambahKategori = async (req, res) => {
    try {
        const { nama_kategori } = req.body;

        // Validasi input
        if (!nama_kategori || nama_kategori.trim() === '') {
            return res.status(400).json({ success: false, message: 'Nama kategori tidak boleh kosong.' });
        }

        // Simpan kategori ke database
        const kategori = await KategoriMasalah.create({ nama_kategori });

        res.status(201).json({ success: true, id: kategori.id_kategori_masalah });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Terjadi kesalahan pada server.' });
    }
};