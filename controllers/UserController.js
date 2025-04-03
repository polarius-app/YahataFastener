const User = require('../models/User');
const bcrypt = require('bcryptjs');
const multer = require('multer');

// Konfigurasi multer untuk upload file ke memory (buffer)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

exports.showLogin = (req, res) => {
    res.render('login', { title: 'Login', error: null });
};

exports.showIndex = (req, res) => {
    res.render('public/index', { title: 'Welcome to Yahata!', error: null });
};

exports.showDashboard = (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    res.render('dashboard', { title: 'Dashboard', user: req.session.user,userLogin: req.session.user });
};

exports.login = async (req, res) => {
    const { username, password } = req.body;

    try {
        // Cari user berdasarkan username
        const user = await User.findOne({ where: { username } });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.render('login', { title: 'Login', error: 'Invalid username or password.' });
        }

        // Konversi foto dari BLOB ke base64
        let fotoBase64 = null;
        if (user.foto) {
            fotoBase64 = user.foto.toString('base64'); // Konversi buffer ke base64
        }

        // Simpan user di session
        req.session.user = {
            id_user: user.id_user,
            fullname: user.fullname,
            username: user.username,
            foto: fotoBase64, // Simpan foto dalam format base64
            jabatan: user.jabatan,
            role: user.role,
            status: user.status,
        };

        // Redirect berdasarkan role
        if (user.role === 'admin') {
            return res.redirect('/admin/dashboard');
        } else {
            return res.redirect('/dashboard');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error.');
    }
};


exports.showRegister = (req, res) => {
    res.render('register', { title: 'Register', error: null });
};

// Middleware upload foto
exports.register = [
    upload.single('foto'), // Menangani upload foto
    async (req, res) => {
        const { username, password, fullname, jabatan, tanggal_masuk } = req.body;
        const foto = req.file ? req.file.buffer : null; // Ambil foto sebagai buffer

        try {
            // Validasi input
            if (!username || !password || !fullname || !jabatan || !tanggal_masuk) {
                return res.render('register', { title: 'Register', error: 'Please fill in all fields.' });
            }

            // Cek apakah username sudah ada
            const existingUser = await User.findOne({ where: { username } });
            if (existingUser) {
                return res.render('register', { title: 'Register', error: 'Username is already taken.' });
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Buat user baru
            const newUser = await User.create({
                username,
                password: hashedPassword,
                fullname,
                jabatan,
                tanggal_masuk,
                foto // Simpan foto sebagai BLOB
            });

            // Redirect ke halaman login setelah registrasi berhasil
            res.redirect('/login');
        } catch (error) {
            console.error(error);
            res.status(500).send('Server error.');
        }
    }
];

exports.logout = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login');
    });
};