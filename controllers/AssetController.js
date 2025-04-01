// controllers/AssetController.js
const Asset = require('../models/Asset');
const Departemen = require('../models/Departemen');
const Merek = require('../models/Merek');
const TipeMerek = require('../models/TipeMerek');
const User = require('../models/User');
const Spesifikasi = require('../models/Spesifikasi');
const Software = require('../models/Software');
const Keamanan = require('../models/Keamanan');
const Jaringan = require('../models/Jaringan');

exports.getAll = async (req, res) => {
  try {
    const userLogin = await User.findByPk(req.session.user.id_user);
    const assets = await Asset.findAll({
      include: [
        { model: Merek, as: 'merek' },
        { model: TipeMerek, as: 'tipeMerek' },
        { model: Departemen, as: 'departemenData' },
        { model: Spesifikasi, as: 'spesifikasi' },
        { model: Software, as: 'software' },
        { model: Keamanan, as: 'keamanan' },
        { model: Jaringan, as: 'jaringan' } // jika ingin
      ]
    });
    res.render('asset/list-aset', { 
      title: 'Asset List', 
      assets, 
      user: req.session.user,
      userLogin 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error.' });
  }
};

// exports.createForm = async (req, res) => {
//     try {
//       const departemenList = await Departemen.findAll();
//       const merekList = await Merek.findAll();
//       const tipeMerekList = await TipeMerek.findAll();
//       res.render('asset/create-aset', {
//         title: 'Insert Asset',
//         error: null,
//         departemenList,
//         merkList: merekList,
//         tipeMerekList,
//         user: req.session.user // Kirim data user ke view jika diperlukan
//       });
//     } catch (error) {
//       console.error('Error rendering new asset form:', error);
//       res.status(500).send('Server error.');
//     }
//   };

exports.createForm = async (req, res) => {
  try {
    const departemenList = await Departemen.findAll();
    const merekList = await Merek.findAll();
    const tipeMerekList = await TipeMerek.findAll();
    const userLogin = await User.findByPk(req.session.user.id_user);
    console.log("merkList:", merekList);  // Debug: pastikan data sudah ada
    res.render('asset/create-aset', {
      title: 'Insert Asset',
      error: null,
      departemenList,
      merekList,       // pastikan key-nya benar
      tipeMerekList,
      user: req.session.user,
      userLogin
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
    console.log(req.files);
    console.log(req.body);

    // Ambil data user dari session (pastikan User sudah diimpor)
    const userLogin = await User.findByPk(req.session.user.id_user);

    // Jika menggunakan upload.fields(), file akan berada di req.files
    const fotoPath = req.files['foto'] ? req.files['foto'][0].buffer : null;
    const picMicrotikPath = req.files['pic_microtik'] ? req.files['pic_microtik'][0].buffer : null;

    const {
      nc_asset,
      antivirus,
      hostname,
      user,
      id_departemen,          // seharusnya berupa ID departemen
      tanggal_pembelian,
      id_merek,                // dari form, seharusnya ID merek
      id_tipe_merek,           // dari form, seharusnya ID tipe merek
      umur_asset
    } = req.body;

    // Validasi: Pastikan nc_asset diisi
    if (!nc_asset) {
      const departemenList = await Departemen.findAll();
      const merekList = await Merek.findAll();
      const tipeMerekList = await TipeMerek.findAll();
      return res.render('asset/create-aset', {
        title: 'Insert Asset',
        error: 'NC Asset wajib diisi!',
        departemenList,
        merekList,
        tipeMerekList,
        user: req.session.user,
        userLogin
      });
    }

    // Buat asset baru dengan mapping field yang benar:
    const newAsset = await Asset.create({
      nc_asset,
      antivirus,
      // Gunakan salah satu; contoh gunakan fotoPath
      foto: fotoPath,
      hostname,
      user,
      id_departemen: id_departemen,          // mapping ke kolom foreign key yang benar
      tanggal_pembelian: tanggal_pembelian,
      id_merek: id_merek,                     // mapping di sini: gunakan id_merek
      id_tipe_merek: id_tipe_merek,           // mapping di sini: gunakan id_tipe_merek
      umur_asset,
      pic_microtik: picMicrotikPath        // simpan dokumen pic_microtik
    });

    res.redirect('/asset');
  } catch (error) {
    console.error('Error creating asset:', error);
    const departemenList = await Departemen.findAll();
    const merekList = await Merek.findAll();
    const tipeMerekList = await TipeMerek.findAll();
    const userLogin = await User.findByPk(req.session.user.id_user);
    res.render('asset/create-aset', {
      title: 'Insert Asset',
      error: 'Terjadi kesalahan saat menyimpan data.',
      departemenList,
      merekList,
      tipeMerekList,
      user: req.session.user,
      userLogin
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

    const {
      nc_asset,           // dari form, akan di-mapping ke nc_asset
      antivirus,
      hostname,
      user,
      departemen,         // foreign key
      tanggal_pembelian, // akan di-mapping ke tanggal_pembelian
      merk,               // foreign key
      tipe_merek          // foreign key
    } = req.body;

    await asset.update({
      nc_asset,
      antivirus,
      hostname,
      user,
      departemen: departemen || null,
      tanggal_pembelian: tanggal_pembelian || null,
      merk: merk || null,
      tipe_merek: tipe_merek || null,
      // Jika perlu update umur_asset, tambahkan di sini
    });

    res.json(asset);
  } catch (error) {
    console.error('Error updating asset:', error);
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