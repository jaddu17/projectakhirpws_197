// controllers/authController.js
const { User } = require('../models');
const crypto = require('crypto');

// POST /auth/register — Hanya untuk membuat ADMIN pertama (tanpa autentikasi)
exports.register = async (req, res) => {
  try {
    const { username, password, nama_lengkap, role } = req.body;

    // Validasi: hanya izinkan role 'admin' di endpoint ini
    if (role !== 'admin') {
      return res.status(400).json({ message: 'Registrasi langsung hanya untuk role admin' });
    }

    // Cek apakah sudah ada admin
    const existingAdmin = await User.findOne({ where: { role: 'admin' } });
    if (existingAdmin) {
      return res.status(403).json({ message: 'Admin sudah terdaftar. Gunakan akun admin untuk menambah user.' });
    }

    // Buat akun admin pertama
    const newUser = await User.create({
      username,
      password, // plain text (untuk tugas)
      nama_lengkap,
      role: 'admin',
      api_key: null // belum login, jadi belum ada API Key
    });

    res.status(201).json({
      message: 'Admin berhasil dibuat',
      user: {
        id: newUser.id,
        username: newUser.username,
        nama_lengkap: newUser.nama_lengkap,
        role: newUser.role
      }
    });
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: 'Username sudah digunakan' });
    }
    res.status(500).json({ message: err.message });
  }
};

// Helper: generate API Key unik
const generateApiKey = () => crypto.randomBytes(32).toString('hex');

// POST /auth/login
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username dan password wajib diisi' });
    }

    const user = await User.findOne({ where: { username } });
    if (!user || user.password !== password) {
      return res.status(401).json({ message: 'Username atau password salah' });
    }

    // Generate API Key baru
    const apiKey = generateApiKey();
    await user.update({ api_key: apiKey });

    res.json({
      message: 'Login berhasil',
      api_key: apiKey,
      user: {
        id: user.id,
        username: user.username,
        nama_lengkap: user.nama_lengkap,
        role: user.role
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /auth/logout
exports.logout = async (req, res) => {
  try {
    // Nonaktifkan API Key
    await req.user.update({ api_key: null });
    res.json({ message: 'Logout berhasil' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};