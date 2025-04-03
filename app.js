const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/login');
const dashboardRoutes = require('./routes/dashboard');
const userController = require('./controllers/UserController');
const sequelize = require('./config/db');
const adminRoutes = require('./routes/admin');
const pengaduanRoutes = require('./routes/pengaduan');
const assetRoutes = require('./routes/asset');
require('dotenv').config();
require('./models/Relasi-Aset');

const app = express();

app.set('view engine', 'ejs');
// Mengatur path views ke folder "views" dan "views/public"
app.set('views', [__dirname + '/views', __dirname + '/views/public']);

// Middleware untuk form URL-encoded
app.use(bodyParser.urlencoded({ extended: true }));
// Middleware untuk parsing JSON
app.use(express.json());

app.use(session({
    secret: 'yahatacelek',
    resave: false,
    saveUninitialized: true
}));

// Mengakses folder static: assets dan views/public (untuk font, css, dll.)
app.use(express.static(__dirname + '/assets'));
app.use(express.static(__dirname + '/views/public')); // Perbaikan: tambahkan slash sebelum "views/public"

sequelize.sync()
    .then(() => console.log('Database connected'))
    .catch(err => console.log('Error: ' + err));

app.get('/', userController.showIndex);

app.use('/', authRoutes);
app.use('/', dashboardRoutes);
app.use('/', adminRoutes);
app.use('/pengaduan', pengaduanRoutes);
app.use('/asset', assetRoutes);

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
// // Auto ShutDown Server dalam 5 jam dari sekarang
// const shutdownTime = 5 * 60 * 60 * 1000; // 5 hours in milliseconds

// // Countdown: menampilkan sisa waktu setiap detik
// let remainingTime = shutdownTime;
// const countdownInterval = setInterval(() => {
//   remainingTime -= 1000;
//   if (remainingTime < 0) remainingTime = 0;
//   const hours = Math.floor(remainingTime / (60 * 60 * 1000));
//   const minutes = Math.floor((remainingTime % (60 * 60 * 1000)) / (60 * 1000));
//   const seconds = Math.floor((remainingTime % (60 * 1000)) / 1000);
//   console.log(`Waktu tersisa: ${hours} jam ${minutes} menit ${seconds} detik`);
//   if (remainingTime <= 0) clearInterval(countdownInterval);
// }, 1000);

// setTimeout(() => {
//   console.log('Server akan dimatikan sekarang setelah 5 jam. Menyimpan semua perubahan dan shutdown secara graceful...');
//   // Tutup koneksi database jika diperlukan
//   sequelize.close()
//     .then(() => {
//       console.log('Koneksi database berhasil ditutup.');
//       server.close(() => {
//         console.log('Server telah dimatikan.');
//         process.exit(0);
//       });
//     })
//     .catch(err => {
//       console.error('Error menutup koneksi database:', err);
//       process.exit(1);
//     });
// }, shutdownTime);