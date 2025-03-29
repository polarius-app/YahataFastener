// controllers/AssetController.js
const Asset = require('../models/Asset');
const Departemen = require('../models/Departemen');
const Merek = require('../models/Merek');
const TipeMerek = require('../models/TipeMerek');

exports.getAll = async (req, res) => {
  try {
    const assets = await Asset.findAll({
      include: [
        { model: Merek, as: 'merek' },
        { model: TipeMerek, as: 'tipeMerek' },
        { model: Departemen, as: 'departemenData' }
      ]
    });
    res.json(assets);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error.' });
  }
};

exports.createForm = async (req, res) => {
    try {
      const departemenList = await Departemen.findAll();
      const merekList = await Merek.findAll();
      const tipeMerekList = await TipeMerek.findAll();
      res.render('asset/create-aset', {
        title: 'Insert Asset',
        error: null,
        departemenList,
        merekList,
        tipeMerekList
      });
    } catch (error) {
      console.error('Error rendering new asset form:', error);
      res.status(500).send('Server error.');
    }
  };
  

// exports.getOne = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const asset = await Asset.findByPk(id, {
//       include: [
//         { model: Merek, as: 'merek' },
//         { model: TipeMerek, as: 'tipeMerek' },
//         { model: Departemen, as: 'departemenData' }
//       ]
//     });
//     if (!asset) {
//       return res.status(404).json({ error: 'Asset not found.' });
//     }
//     res.json(asset);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Server error.' });
//   }
// };

exports.create = async (req, res) => {
    try {
      const {
        no_asset,
        antivirus,
        hostname,
        user,
        departemen,        // foreign key (ID departemen)
        tanggal_penempatan,
        merk,              // foreign key (ID merek)
        tipe_merek         // foreign key (ID tipe merek)
      } = req.body;
  
      // Ambil foto jika diupload; file disimpan dalam memori sebagai Buffer
      let fotoBuffer = null;
      if (req.file) {
        fotoBuffer = req.file.buffer;
      }
  
      // Validasi sederhana, misal no_asset harus diisi
      if (!no_asset) {
        // Dapatkan data dropdown untuk render ulang form
        const departemenList = await Departemen.findAll();
        const merekList = await Merek.findAll();
        const tipeMerekList = await TipeMerek.findAll();
  
        return res.render('insert-asset', {
          title: 'Insert Asset',
          error: 'No Asset wajib diisi!',
          departemenList,
          merekList,
          tipeMerekList
        });
      }
  
      // Simpan data ke database, foto disimpan sebagai BLOB
      const newAsset = await Asset.create({
        no_asset,
        antivirus,
        foto: fotoBuffer,  // Simpan file ke kolom foto
        hostname,
        user,
        departemen: departemen || null,
        tanggal_penempatan: tanggal_penempatan || null,
        merk: merk || null,
        tipe_merek: tipe_merek || null
      });
  
      res.redirect('/asset');
    } catch (error) {
      console.error('Error creating asset:', error);
      // Render ulang form dengan error message jika terjadi kesalahan
      const departemenList = await Departemen.findAll();
      const merekList = await Merek.findAll();
      const tipeMerekList = await TipeMerek.findAll();
      res.render('/asset/create-aset', {
        title: 'Insert Asset',
        error: 'Terjadi kesalahan saat menyimpan data.',
        departemenList,
        merekList,
        tipeMerekList
      });
    }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const asset = await Asset.findByPk(id);
    if (!asset) {
      return res.status(404).json({ error: 'Asset not found.' });
    }
    await asset.update(req.body);
    res.json(asset);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error.' });
  }
};

exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    const asset = await Asset.findByPk(id);
    if (!asset) {
      return res.status(404).json({ error: 'Asset not found.' });
    }
    await asset.destroy();
    res.json({ message: 'Asset deleted successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error.' });
  }
};