const { DaftarMasalah, KategoriMasalah, Periode } = require('../models');
const User = require('../models/User'); // Pastikan Anda sudah mengimpor model User
const { Op, fn, col } = require('sequelize');

exports.formPengaduan = async (req, res) => {
  try {
    // Ambil data kategori untuk dropdown
    const kategoriList = await KategoriMasalah.findAll();
    // Ambil data periode untuk dropdown (opsional)
    const periodeList = await Periode.findAll();
    const tb_daftar_masalah = await DaftarMasalah.findByPk(req.params.id); // Sesuaikan dengan kebutuhan
    const userLogin = await User.findByPk(req.session.user.id_user); // Ambil data user yang sedang login

    res.render('pengaduan/pengaduan_form', {
      title: 'Form Pengaduan Masalah',
      kategoriList,
      periodeList,
      tb_daftar_masalah, // Kirim data daftar masalah jika diperlukan
      user: req.session.user, // Kirim data user ke view jika diperlukan
      userLogin,
      error: null
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error.');
  }
};

exports.simpanPengaduan = async (req, res) => {
    try {
      const {
        nama,
        departemen,
        tanggal_kejadian,
        waktu_kejadian,
        kendala_masalah,
        id_kategori_masalah, // langsung diterima dari form
        id_periode
      } = req.body;
  
      // Validasi sederhana
      if (!nama || !departemen || !tanggal_kejadian || !waktu_kejadian || !kendala_masalah) {
        return res.render('pengaduan/pengaduan_form', {
          title: 'Form Pengaduan Masalah',
          error: 'Mohon isi semua field yang diperlukan.',
          kategoriList: await KategoriMasalah.findAll(),
          periodeList: await Periode.findAll()
        });
      }
  
      // Buat pengaduan baru dengan menyertakan id_kategori_masalah
      await DaftarMasalah.create({
        nama,
        departemen,
        tanggal_kejadian,
        waktu_kejadian,
        kendala_masalah,
        id_kategori_masalah: id_kategori_masalah || null,
        id_periode: id_periode || null,
        status: 'open'
      });
  
      res.redirect('/pengaduan/daftar');
    } catch (error) {
      console.error(error);
      res.status(500).send('Server error.');
    }
  };
  
exports.daftarPengaduan = async (req, res) => {
  try {
    const userLogin = await User.findByPk(req.session.user.id_user); // Ambil data user yang sedang login
    // Ambil semua data pengaduan termasuk relasi kategori & periode
    const daftar = await DaftarMasalah.findAll({
      include: [
        { model: KategoriMasalah, as: 'kategori' },
        { model: Periode, as: 'periode' }
      ],
      order: [['id_daftar_masalah', 'DESC']]
    });

    res.render('pengaduan/pengaduan_daftar', {
      title: 'Daftar Pengaduan Masalah',
      daftar,
      user: req.session.user, // Kirim data user ke view jika diperlukan
      userLogin
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error.');
  }
};

exports.showByIDPengaduan = async (req, res) => {
    try {
      const { id } = req.params;
      // Cari pengaduan berdasarkan primary key dengan menyertakan relasi kategori dan periode
      const pengaduan = await DaftarMasalah.findByPk(id, {
        include: [
          { model: KategoriMasalah, as: 'kategori' },
          { model: Periode, as: 'periode' }
        ]
      });
      if (!pengaduan) return res.status(404).send('Pengaduan tidak ditemukan.');
      
      // Ambil daftar kategori dan periode untuk dropdown di form edit
      const kategoriList = await KategoriMasalah.findAll();
      const periodeList = await Periode.findAll();
      
      // Render view form edit dengan data pengaduan yang sudah ada
      res.render('pengaduan/pengaduan_edit', { 
        title: 'Edit Pengaduan', 
        pengaduan,
        kategoriList,
        periodeList,
        user: req.session.user, // Kirim data user ke view jika diperlukan
        error: null 
      });
    } catch (error) {
      console.error(error);
      res.status(500).send('Server error.');
    }
  };
  
  exports.updatePengaduan = async (req, res) => {
    try {
      const { id } = req.params;
      console.log(`Received update request for pengaduan with id: ${id}`);
      console.log('Input values:');
      const {
        nama,
        departemen,
        tanggal_kejadian,
        waktu_kejadian,
        kendala_masalah,
        id_kategori_masalah,
        id_periode,
        tanggal_perbaikan,
        waktu_perbaikan,
        perbaikan,
        status,
        keterangan  // pastikan field ini juga dideklarasikan
      } = req.body;
      
      console.log("nama:", nama);
      console.log("departemen:", departemen);
      console.log("tanggal_kejadian:", tanggal_kejadian);
      console.log("waktu_kejadian:", waktu_kejadian);
      console.log("kendala_masalah:", kendala_masalah);
      console.log("id_kategori_masalah:", id_kategori_masalah);
      console.log("id_periode:", id_periode);
      console.log("tanggal_perbaikan:", tanggal_perbaikan);
      console.log("waktu_perbaikan:", waktu_perbaikan);
      console.log("perbaikan:", perbaikan);
      console.log("status:", status);
      console.log("keterangan:", keterangan);
      
      // Validasi sederhana
      if (!nama || !departemen || !tanggal_kejadian || !waktu_kejadian || !kendala_masalah) {
        const kategoriList = await KategoriMasalah.findAll();
        const periodeList = await Periode.findAll();
        return res.render('user/pengaduan_edit', {
          title: 'Edit Pengaduan',
          pengaduan: { 
            id_daftar_masalah: id, 
            nama, 
            departemen, 
            tanggal_kejadian, 
            waktu_kejadian, 
            kendala_masalah, 
            id_kategori_masalah, 
            id_periode, 
            tanggal_perbaikan, 
            waktu_perbaikan, 
            perbaikan, 
            status, 
            keterangan
          },
          kategoriList,
          periodeList,
          error: 'Mohon isi semua field yang diperlukan.',
          user: req.session.user
        });
      }
      
      // Cari pengaduan yang akan diupdate
      const pengaduan = await DaftarMasalah.findByPk(id);
      if (!pengaduan) {
        return res.status(404).send('Pengaduan tidak ditemukan.');
      }
      
      console.log("Pengaduan sebelum update:", pengaduan.get({ plain: true }));
      
      // Update pengaduan, termasuk field keterangan
      await pengaduan.update({
        nama,
        departemen,
        tanggal_kejadian,
        waktu_kejadian,
        kendala_masalah,
        id_kategori_masalah: id_kategori_masalah || null,
        id_periode: id_periode || null,
        tanggal_perbaikan: tanggal_perbaikan || null,
        waktu_perbaikan: waktu_perbaikan || null,
        perbaikan: perbaikan || null,
        status: status || 'open',
        keterangan: keterangan || null  // Tambahkan field keterangan di sini
      });
      
      console.log("Pengaduan setelah update:", pengaduan.get({ plain: true }));
      
      res.redirect('/pengaduan/daftar');
    } catch (error) {
      console.error("Error in updatePengaduan:", error);
      res.status(500).send('Server error.');
    }
  };
    
  

  exports.hapusPengaduan = async (req, res) => {
    try {
      const { id } = req.params;
      // Cari pengaduan berdasarkan primary key
      const pengaduan = await DaftarMasalah.findByPk(id);
      if (!pengaduan) {
        return res.status(404).send('Pengaduan tidak ditemukan.');
      }
  
      // Cek status pengaduan
      if (pengaduan.status !== 'open') {
        // Jika status tidak open, tolak penghapusan
        return res.status(403).send('Pengaduan dengan status close tidak dapat dihapus.');
      }
  
      // Jika status open, hapus pengaduan
      await pengaduan.destroy();
      res.redirect('/pengaduan/daftar');
    } catch (error) {
      console.error(error);
      res.status(500).send('Server error.');
    }
  };

exports.getChartData = async (req, res) => {
  try {
    const selectedYear = parseInt(req.query.year) || new Date().getFullYear();

    // Query untuk data closed
    const closedDataResult = await DaftarMasalah.findAll({
      attributes: [
        [fn('MONTH', col('tanggal_kejadian')), 'month'],
        [fn('COUNT', col('id_daftar_masalah')), 'count']
      ],
      where: {
        status: 'close',
        tanggal_kejadian: {
          [Op.between]: [new Date(selectedYear, 0, 1), new Date(selectedYear, 11, 31)]
        }
      },
      group: [fn('MONTH', col('tanggal_kejadian'))],
      raw: true
    });

    // Query untuk data open
    const openDataResult = await DaftarMasalah.findAll({
      attributes: [
        [fn('MONTH', col('tanggal_kejadian')), 'month'],
        [fn('COUNT', col('id_daftar_masalah')), 'count']
      ],
      where: {
        status: 'open',
        tanggal_kejadian: {
          [Op.between]: [new Date(selectedYear, 0, 1), new Date(selectedYear, 11, 31)]
        }
      },
      group: [fn('MONTH', col('tanggal_kejadian'))],
      raw: true
    });

    // Format data untuk dikirim ke frontend
    const dataClosed = Array(12).fill(0);
    const dataOpen = Array(12).fill(0);

    closedDataResult.forEach(item => {
      dataClosed[item.month - 1] = parseInt(item.count);
    });

    openDataResult.forEach(item => {
      dataOpen[item.month - 1] = parseInt(item.count);
    });

    res.json({ dataClosed, dataOpen });
  } catch (error) {
    console.error('Error fetching chart data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};