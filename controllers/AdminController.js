const User = require('../models/User');

exports.showUser = async (req, res) => {
    try {
        // Step 1: Determine the current page and page size
        const page = parseInt(req.query.page) || 1; // Default to page 1 if not provided
        const limit = 10; // Number of users per page

        // Step 2: Calculate the offset
        const offset = (page - 1) * limit;

        // Step 3: Retrieve users with pagination
        const { count, rows } = await User.findAndCountAll({
            offset: offset,
            limit: limit
        });

        // Step 4: Calculate total pages
        const totalPages = Math.ceil(count / limit);

        // Step 5: Format user data
        const formattedUsers = rows.map(user => ({
            ...user.toJSON(),
            tanggal_masuk: user.tanggal_masuk ? new Date(user.tanggal_masuk).toISOString().split('T')[0] : null
        }));

        // Step 6: Retrieve admin details
        const admin = await User.findByPk(req.session.user.id_user);
        const fullname = admin ? admin.fullname : 'Admin';
        const foto = req.session.user.foto;

        const totalUsers = formattedUsers.length; // atau ambil total user dari query database

res.render('admin/list-user', {
    users: formattedUsers,
    fullname,
    foto,
    user: admin,
    currentPage: page,
    totalPages: totalPages,
    totalUsers: totalUsers // properti baru yang ditambahkan
});
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error.');
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