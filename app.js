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

const app = express();

app.set('view engine', 'ejs');
app.set('views', [__dirname + '/views', __dirname + '/views/public']);

// Middleware untuk form URL-encoded
app.use(bodyParser.urlencoded({ extended: true }));

// Tambahkan middleware untuk parsing JSON
app.use(express.json());

app.use(session({
    secret: 'yahatacelek',
    resave: false,
    saveUninitialized: true
}));

// Akses ke folder assets
app.use(express.static(__dirname + '/assets'));

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