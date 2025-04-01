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
const sequelize = require('../config/db');

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
        { model: Jaringan, as: 'jaringan' }
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

exports.createForm = async (req, res) => {
  try {
    const departemenList = await Departemen.findAll();
    const merekList = await Merek.findAll();
    const tipeMerekList = await TipeMerek.findAll();
    const userLogin = await User.findByPk(req.session.user.id_user);
    res.render('asset/create-aset', {
      title: 'Insert Asset',
      error: null,
      departemenList,
      merekList,
      tipeMerekList,
      user: req.session.user,
      userLogin
    });
  } catch (error) {
    console.error('Error rendering new asset form:', error);
    res.status(500).send('Server error.');
  }
};

exports.create = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    console.log("Files:", req.files);
    console.log("Body:", req.body);

    // Ambil file upload menggunakan multer.fields()
    const fotoBuffer = req.files['foto'] ? req.files['foto'][0].buffer : null;
    const picMicrotikBuffer = req.files['pic_microtik'] ? req.files['pic_microtik'][0].buffer : null;

    // Ambil field dari form
    const {
      nc_asset,
      antivirus,
      hostname,
      user,
      id_departemen,
      tanggal_pembelian,
      id_merek,
      id_tipe_merek,
      umur_asset,
      spesifikasi, // Array spesifikasi
      deskripsi_spesifikasi, // Array deskripsi spesifikasi
      nama_software, // Array nama software
      status_software, // Array status software
      kunci_lisensi, // Array kunci lisensi
      keamanan_username, // Array username keamanan
      keamanan_password, // Array password keamanan
      keamanan_keterangan, // Array keterangan keamanan
      ip_address,
      mac_address
    } = req.body;

    // Validasi semua field wajib (termasuk file)
    if (
      !nc_asset || !antivirus || !hostname || !user || !id_departemen ||
      !tanggal_pembelian || !id_merek || !id_tipe_merek || !umur_asset ||
      !spesifikasi || !deskripsi_spesifikasi ||
      !nama_software || !status_software || !kunci_lisensi ||
      !keamanan_username || !keamanan_password || !keamanan_keterangan ||
      !ip_address || !mac_address
    ) {
      throw new Error("Semua field wajib diisi.");
    }
    if (!fotoBuffer || !picMicrotikBuffer) {
      throw new Error("File foto dan pic_microtik wajib diupload.");
    }

    // Insert ke tb_asset
    const newAsset = await Asset.create({
      nc_asset,
      antivirus,
      foto: fotoBuffer,
      hostname,
      user,
      id_departemen,
      tanggal_pembelian,
      id_merek,
      id_tipe_merek,
      umur_asset,
      pic_microtik: picMicrotikBuffer
    }, { transaction });

    const id_asset = newAsset.id_asset;
    console.log("Asset baru dengan id:", id_asset);

    // Insert ke tb_spesifikasi
    if (spesifikasi && deskripsi_spesifikasi) {
      const spesifikasiArr = Array.isArray(spesifikasi) ? spesifikasi : [spesifikasi];
      const deskripsiArr = Array.isArray(deskripsi_spesifikasi) ? deskripsi_spesifikasi : [deskripsi_spesifikasi];
      const spesifikasiData = spesifikasiArr.map((item, index) => ({
        id_asset,
        spesifikasi: item,
        deskripsi_spesifikasi: deskripsiArr[index] || ''
      }));
      await Spesifikasi.bulkCreate(spesifikasiData, { transaction });
      console.log("Spesifikasi Data:", spesifikasiData);
    }

    // Insert ke tb_software
    if (nama_software && status_software && kunci_lisensi) {
      const namaSoftwareArr = Array.isArray(nama_software) ? nama_software : [nama_software];
      const statusSoftwareArr = Array.isArray(status_software) ? status_software : [status_software];
      const kunciLisensiArr = Array.isArray(kunci_lisensi) ? kunci_lisensi : [kunci_lisensi];
      const softwareData = namaSoftwareArr.map((item, index) => ({
        id_asset,
        nama_software: item,
        status: statusSoftwareArr[index] || '',
        kunci_lisensi: kunciLisensiArr[index] || ''
      }));
      await Software.bulkCreate(softwareData, { transaction });
      console.log("Software Data:", softwareData);
    }

    // Insert ke tb_keamanan
    if (keamanan_username && keamanan_password && keamanan_keterangan) {
      const keamananUsernameArr = Array.isArray(keamanan_username) ? keamanan_username : [keamanan_username];
      const keamananPasswordArr = Array.isArray(keamanan_password) ? keamanan_password : [keamanan_password];
      const keamananKeteranganArr = Array.isArray(keamanan_keterangan) ? keamanan_keterangan : [keamanan_keterangan];
      const keamananData = keamananUsernameArr.map((item, index) => ({
        id_asset,
        username: item,
        password: keamananPasswordArr[index] || '',
        keterangan: keamananKeteranganArr[index] || ''
      }));
      await Keamanan.bulkCreate(keamananData, { transaction });
      console.log("Keamanan Data:", keamananData);
    }

    // Insert ke tb_jaringan
    await Jaringan.create({
      id_asset,
      ip_address,
      mac_address
    }, { transaction });
    console.log("Jaringan Data:", { id_asset, ip_address, mac_address });

    // Commit transaksi jika semua operasi berhasil
    await transaction.commit();
    res.redirect('/asset');
  } catch (error) {
    await transaction.rollback();
    console.error('Error creating asset:', error);
    // Jika terjadi error, ambil data dropdown kembali untuk form insert
    const departemenList = await Departemen.findAll();
    const merekList = await Merek.findAll();
    const tipeMerekList = await TipeMerek.findAll();
    const userLogin = await User.findByPk(req.session.user.id_user);
    res.render('asset/create-aset', {
      title: 'Insert Asset',
      error: error.message || 'Terjadi kesalahan saat menyimpan data.',
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
      nc_asset,
      antivirus,
      hostname,
      user,
      departemen,
      tanggal_pembelian,
      merk,
      tipe_merek,
      umur_asset
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
      umur_asset: umur_asset || null
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