const Departemen = require('../models/Departemen');

exports.tambahDepartemen = async (req, res) => {
    try {
      const { nama_departemen, email } = req.body;
      if (!nama_departemen || nama_departemen.trim() === '') {
        return res.status(400).json({ success: false, message: 'Nama departemen tidak boleh kosong.' });
      }
      if (!email || email.trim() === '') {
        return res.status(400).json({ success: false, message: 'Email departemen tidak boleh kosong.' });
      }
  
      const departemen = await Departemen.create({ 
        departemen: nama_departemen, 
        email 
      });
  
      res.status(201).json({ success: true, id: departemen.id_departemen });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Terjadi kesalahan pada server.' });
    }
};
  