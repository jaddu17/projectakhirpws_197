require('dotenv').config();
const express = require('express');
const connectDatabase = require('./config/db');

const app = express();

// ✅ CORS + OPTIONS handler (WAJIB DI ATAS SEMUA)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'X-API-Key, Content-Type');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');

  if (req.method === 'OPTIONS') {
    res.sendStatus(200); // Preflight sukses
  } else {
    next();
  }
});

app.use(express.json());
connectDatabase();

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/pasien', require('./routes/pasienRoutes'));
app.use('/api/dokter', require('./routes/dokterRoutes'));
app.use('/api/janji-temu', require('./routes/janjiTemuRoutes'));
app.use('/api/rekam-medis', require('./routes/rekamMedisRoutes'));
app.use('/api/tindakan', require('./routes/tindakanRoutes'));

app.use((req, res) => {
  res.status(404).json({ message: 'Endpoint tidak ditemukan' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server berjalan di http://localhost:${PORT}/api/`);
});