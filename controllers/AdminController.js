const User = require('../models/User');
const { Op, where, fn, col } = require('sequelize');
const Asset = require('../models/Asset');
const DaftarMasalah = require('../models/DaftarMasalah');
const bcrypt = require('bcrypt');

exports.showUser = async (req, res) => {
    try {
        // Step 1: Tentukan halaman saat ini dan ukuran halaman
        const page = parseInt(req.query.page) || 1; // Default ke halaman 1 jika tidak disediakan
        const limit = 9; // Jumlah user per halaman
        const search = req.query.search || '';
        const roleFilter = req.query.roleFilter || '';

        const whereCondition = {
            [Op.and]: [
                {
                    [Op.or]: [
                        { fullname: { [Op.like]: `%${search}%` } },
                        { username: { [Op.like]: `%${search}%` } }
                    ]
                }
            ]
        };

        // Tambahkan filter roles jika ada
        if (roleFilter) {
            whereCondition[Op.and].push({ role: roleFilter });
        }
        // Step 2: Hitung offset
        const offset = (page - 1) * limit;

        // Step 3: Ambil data user dengan pagination dan total count
        const { count, rows } = await User.findAndCountAll({
            where: whereCondition,
            offset: offset,
            limit: limit
        });

        // Step 4: Hitung total halaman
        const totalPages = Math.ceil(count / limit);

        // Step 5: Format data user untuk halaman saat ini
        const formattedUsers = rows.map(user => ({
            ...user.toJSON(),
            tanggal_masuk: user.tanggal_masuk ? new Date(user.tanggal_masuk).toISOString().split('T')[0] : null
        }));

        // Total user adalah nilai count (seluruh data)
        const totalUsers = count;

        // Step 6: Ambil data admin yang sedang login
        const admin = await User.findByPk(req.session.user.id_user);
        const userLogin = await User.findByPk(req.session.user.id_user);
        const fullname = admin ? admin.fullname : 'Admin';
        const foto = req.session.user.foto;

        res.render('admin/list-user', {
            users: formattedUsers,
            fullname,
            foto,
            user: admin,
            currentPage: page,
            totalPages: totalPages,
            totalUsers: totalUsers, // Menggunakan total count dari database
            search,
            roleFilter,
            userLogin

        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error.');
    }
};

exports.toggleUserStatus = async (req, res) => {
    try {
      const userId = req.params.id;
      const { status } = req.body;
  
      // Perbarui status pengguna di database
      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({ message: 'User tidak ditemukan.' });
      }
  
      user.status = status;
      await user.save();
  
      res.status(200).json({ message: 'Status berhasil diperbarui.' });
    } catch (error) {
      console.error('Error updating status:', error);
      res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
    }
  };


  exports.showDashboard = async (req, res) => {
    try {
      // Ambil data user dan asset seperti sebelumnya
      const users = await User.findAll();
      const admin = await User.findByPk(req.session.user.id_user);
      const fullname = admin ? admin.fullname : 'Admin';
      const foto = req.session.user.foto;
      const userLogin = await User.findByPk(req.session.user.id_user);
  
      const totalAdmin = await User.count({ where: { role: 'admin' } });
      const totalUser = await User.count({ where: { role: 'user' } });
      const totalAsset = await Asset.count();

      const totalClosedPengaduan = await DaftarMasalah.count({ where: { status: 'close' } });
      const totalOpenPengaduan = await DaftarMasalah.count({ where: { status: 'open' } });
  
      // Filter tahun dari query, default ke tahun sekarang
      const selectedYear = req.query.year ? parseInt(req.query.year) : new Date().getFullYear();
  
      // Query untuk pengaduan dengan status "closed"
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
  
      // Query untuk pengaduan dengan status "open"
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
  
      // Buat array 12 elemen untuk tiap bulan (default 0)
      const dataClosed = Array(12).fill(0);
      const dataOpen = Array(12).fill(0);
  
      closedDataResult.forEach(item => {
        const month = item.month; // 1 - 12
        dataClosed[month - 1] = parseInt(item.count);
      });
  
      openDataResult.forEach(item => {
        const month = item.month;
        dataOpen[month - 1] = parseInt(item.count);
      });
  
      // Contoh: buat array tahun untuk dropdown filter
      const availableYears = [selectedYear - 1, selectedYear, selectedYear + 1];
  
      // Format data pengguna (jika diperlukan)
      const formattedUsers = users.map(user => ({
        ...user.toJSON(),
        tanggal_masuk: user.tanggal_masuk ? new Date(user.tanggal_masuk).toISOString().split('T')[0] : null
      }));
  
      res.render('admin/dashboard-admin', {
        users: formattedUsers,
        fullname,
        foto,
        user: admin,
        userLogin,
        totalAdmin,
        totalUser,
        totalAsset,
        labelsBulan: ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"],
        dataClosed,
        dataOpen,
        selectedYear,
        availableYears,
        totalClosedPengaduan,
        totalOpenPengaduan
      });
    } catch (error) {
      console.error(error);
      res.status(500).send('Server error.');
    }
};  



// Show form to create a new user
exports.showCreateUserForm = async (req, res) => {
  try {
      const userLogin = await User.findByPk(req.session.user.id_user);
      res.render('admin/create-user', {
          title: 'Create User',
          userLogin, // Kirim userLogin ke view
          user : userLogin
      });
  } catch (error) {
      console.error('Error rendering create user form:', error);
      res.status(500).send('Server error.');
  }
};
// Create a new user
exports.createUser = async (req, res) => {
    const userLogin = await User.findByPk(req.session.user.id_user);
    const { fullname, username, password, role, jabatan, tanggal_masuk, status } = req.body;
    const foto = req.file ? req.file.buffer : null; // Ambil foto jika ada

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({
            fullname,
            username,
            password: hashedPassword,
            role,
            jabatan,
            tanggal_masuk,
            status,
            foto,
            userLogin
        });
        res.redirect('/admin/users');
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error.');
    }
};

// Show form to edit a user
exports.showEditUserForm = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        const userLogin = await User.findByPk(req.session.user.id_user);
        const formattedUser = {
            ...user.toJSON(),
            tanggal_masuk: user.tanggal_masuk ? new Date(user.tanggal_masuk).toISOString().split('T')[0] : null
        };
        res.render('admin/edit-user', { 
            user: formattedUser,
            userLogin
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error.');
    }
};

// Edit a user
exports.editUser = async (req, res) => {
    const { fullname, username, role, jabatan, tanggal_masuk, status } = req.body;
    const foto = req.file ? req.file.buffer : null; // Ambil foto jika ada

    try {
        await User.update(
            { fullname, username, role, jabatan, tanggal_masuk, status, foto },
            { where: { id_user: req.params.id } }
        );
        res.redirect('/admin/users');
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error.');
    }
};

// Delete a user
exports.deleteUser = async (req, res) => {
    try {
        await User.destroy({ where: { id_user: req.params.id } });
        res.redirect('/admin/users');
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error.');
    }
};