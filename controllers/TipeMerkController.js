const TipeMerek = require('../models/TipeMerek');

exports.tambahTipeMerk = async (req, res) => {
    try {
      const { nama_tipe_merek } = req.body;
      if (!nama_tipe_merek || nama_tipe_merek.trim() === '') {
        return res.status(400).json({ success: false, message: 'Nama Merek tidak boleh kosong.' });
      }
  
      const tipe_merek = await TipeMerek.create({ 
        nama_tipe_merek: nama_tipe_merek, 
      });
  
      res.status(201).json({ success: true, id: tipe_merek.id_tipe_merek });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Terjadi kesalahan pada server.' });
    }
};