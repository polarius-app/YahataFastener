const User = require('../models/User');
const { Op, where } = require('sequelize');

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
            roleFilter

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
        // Ambil semua pengguna dari database
        const users = await User.findAll();

        // Ambil data admin yang sedang login dari database
        const admin = await User.findByPk(req.session.user.id_user);
        const fullname = admin ? admin.fullname : 'Admin';
        const foto = req.session.user.foto;

        // Format data pengguna
        const formattedUsers = users.map(user => ({
            ...user.toJSON(),
            tanggal_masuk: user.tanggal_masuk ? new Date(user.tanggal_masuk).toISOString().split('T')[0] : null
        }));

        // Kirim data pengguna dan fullname ke view
        res.render('admin/dashboard-admin', { users: formattedUsers, fullname, foto, user: admin });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error.');
    }
};

// Show form to create a new user
exports.showCreateUserForm = (req, res) => {
    res.render('admin/create-user');
};

// Create a new user
exports.createUser = async (req, res) => {
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
            foto
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
        const formattedUser = {
            ...user.toJSON(),
            tanggal_masuk: user.tanggal_masuk ? new Date(user.tanggal_masuk).toISOString().split('T')[0] : null
        };
        res.render('admin/edit-user', { user: formattedUser });
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