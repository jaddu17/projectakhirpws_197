// middleware/roleMiddleware.js
exports.requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Akses ditolak: hanya admin yang diizinkan' });
  }
  next();
};

exports.requireDokter = (req, res, next) => {
  if (req.user.role !== 'dokter') {
    return res.status(403).json({ message: 'Akses ditolak: hanya dokter yang diizinkan' });
  }
  next();
};