const Asset = require('./Asset');
const Merek = require('./Merek');
const Jaringan = require('./Jaringan');
const Departemen = require('./Departemen');
const Keamanan = require('./Keamanan');
const Spesifikasi = require('./Spesifikasi');
const TipeMerek = require('./TipeMerek');
const Software = require('./Software');

// Contoh relasi: Asset -> Merek
Asset.belongsTo(Merek, {
  foreignKey: 'merk',
  as: 'merek'
});
Merek.hasMany(Asset, {
  foreignKey: 'merk',
  as: 'assets'
});

// Contoh relasi: Asset -> TipeMerek
Asset.belongsTo(TipeMerek, {
  foreignKey: 'tipe_merek',
  as: 'tipeMerek'
});
TipeMerek.hasMany(Asset, {
  foreignKey: 'tipe_merek',
  as: 'assets'
});

// Contoh relasi: Asset -> Departemen
Asset.belongsTo(Departemen, {
  foreignKey: 'departemen',
  as: 'departemenData'
});
Departemen.hasMany(Asset, {
  foreignKey: 'departemen',
  as: 'assets'
});

// Contoh relasi: Spesifikasi -> Asset
Spesifikasi.belongsTo(Asset, {
  foreignKey: 'id_asset',
  as: 'asset'
});
Asset.hasMany(Spesifikasi, {
  foreignKey: 'id_asset',
  as: 'spesifikasi'
});

// Contoh relasi: Software -> Asset
Software.belongsTo(Asset, {
  foreignKey: 'id_asset',
  as: 'asset'
});
Asset.hasMany(Software, {
  foreignKey: 'id_asset',
  as: 'software'
});

// Export semua model
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