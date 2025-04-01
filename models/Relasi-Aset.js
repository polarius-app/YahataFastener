// models/Relasi-Aset.js
const Asset = require('./Asset');
const Merek = require('./Merek');
const Jaringan = require('./Jaringan');
const Departemen = require('./Departemen');
const Keamanan = require('./Keamanan');
const Spesifikasi = require('./Spesifikasi');
const TipeMerek = require('./TipeMerek');
const Software = require('./Software');

// Relasi Asset -> Merek
Asset.belongsTo(Merek, {
  foreignKey: 'id_merek', // gunakan nama kolom sesuai model
  as: 'merek'
});
Merek.hasMany(Asset, {
  foreignKey: 'id_merek',
  as: 'assets'
});

// Relasi Asset -> TipeMerek
Asset.belongsTo(TipeMerek, {
  foreignKey: 'id_tipe_merek', // gunakan nama kolom sesuai model
  as: 'tipeMerek'
});
TipeMerek.hasMany(Asset, {
  foreignKey: 'id_tipe_merek',
  as: 'assets'
});

// Relasi Asset -> Departemen
Asset.belongsTo(Departemen, {
  foreignKey: 'id_departemen', // gunakan nama kolom sesuai model
  as: 'departemenData'
});
Departemen.hasMany(Asset, {
  foreignKey: 'id_departemen',
  as: 'assets'
});

// Relasi Spesifikasi -> Asset
Spesifikasi.belongsTo(Asset, {
  foreignKey: 'id_asset',
  as: 'asset'
});
Asset.hasMany(Spesifikasi, {
  foreignKey: 'id_asset',
  as: 'spesifikasi'
});

// Relasi Software -> Asset
Software.belongsTo(Asset, {
  foreignKey: 'id_asset',
  as: 'asset'
});
Asset.hasMany(Software, {
  foreignKey: 'id_asset',
  as: 'software'
});

Keamanan.belongsTo(Asset, {
  foreignKey: 'id_asset',
  as: 'asset'
});
Asset.hasMany(Keamanan, {
  foreignKey: 'id_asset',
  as: 'keamanan'
});

Jaringan.belongsTo(Asset, {
  foreignKey: 'id_asset',
  as: 'asset'
});
Asset.hasMany(Jaringan, {
  foreignKey: 'id_asset',
  as: 'jaringan'
});

module.exports = {
  Asset,
  Merek,
  Jaringan,
  Departemen,
  Keamanan,
  Spesifikasi,
  TipeMerek,
  Software
};