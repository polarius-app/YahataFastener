const { DaftarMasalah, KategoriMasalah, Periode } = require('../models');

exports.formPengaduan = async (req, res) => {
  try {
    // Ambil data kategori untuk dropdown
    const kategoriList = await KategoriMasalah.findAll();
    // Ambil data periode untuk dropdown (opsional)
    const periodeList = await Periode.findAll();

    res.render('pengaduan/pengaduan_form', {
      title: 'Form Pengaduan Masalah',
      kategoriList,
      periodeList,
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
      daftar
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