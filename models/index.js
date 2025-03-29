const KategoriMasalah = require('./KategoriMasalah');
const DaftarMasalah = require('./DaftarMasalah');
const Periode = require('./Periode');
const DaftarKategori = require('./DaftarKategory'); // Model join

// RELASI:
// 1. DaftarMasalah -> KategoriMasalah (banyak masalah, satu kategori)
// DaftarMasalah.belongsTo(KategoriMasalah, {
//   foreignKey: 'id_kategori_masalah',
//   as: 'kategori'
// });
// KategoriMasalah.hasMany(DaftarMasalah, {
//   foreignKey: 'id_kategori_masalah',
//   as: 'daftarMasalah'
// });
DaftarMasalah.belongsTo(KategoriMasalah, {
    foreignKey: 'id_kategori_masalah',
    as: 'kategori'
  });
KategoriMasalah.hasMany(DaftarMasalah, {
    foreignKey: 'id_kategori_masalah',
    as: 'daftarMasalah'
});

// 2. DaftarMasalah -> Periode (opsional, jika di ERD ada foreign key id_periode)
DaftarMasalah.belongsTo(Periode, {
  foreignKey: 'id_periode',
  as: 'periode'
});
Periode.hasMany(DaftarMasalah, {
  foreignKey: 'id_periode',
  as: 'daftarMasalah'
});

module.exports = {
  KategoriMasalah,
  DaftarMasalah,
  Periode
};