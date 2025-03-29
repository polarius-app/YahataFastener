const { Periode } = require('../models');

const PeriodeController = {
  async tambahPeriode(req, res) {
    try {
      let { tahun_periode, isp_periode } = req.body;
      let newPeriode = await Periode.create({ tahun_periode, isp_periode });

      res.json({ success: true, id: newPeriode.id_periode, tahun_periode, isp_periode });
    } catch (error) {
      res.json({ success: false, message: 'Gagal menambahkan periode!' });
    }
  }
};

module.exports = PeriodeController;