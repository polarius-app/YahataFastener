const Merek = require('../models/Merek');

exports.tambahMerk = async (req, res) => {
    try {
      const { nama_merek } = req.body;
      if (!nama_merek || nama_merek.trim() === '') {
        return res.status(400).json({ success: false, message: 'Nama Merek tidak boleh kosong.' });
      }
  
      const merek = await Merek.create({ 
        nama_merek: nama_merek, 
      });
  
      res.status(201).json({ success: true, id: merek.id_merek });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Terjadi kesalahan pada server.' });
    }
};