require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const morgan = require('morgan');

const authRoutes = require('./routes/authRoutes');
const petRoutes = require('./routes/petRoutes');
const profileRoutes = require('./routes/profileRoutes');
const adminRoutes = require('./routes/adminRoutes');
const campaignRoutes = require('./routes/campaignRoutes');

const app = express();

// Confiança em proxy (ngrok)
app.set('trust proxy', 1);

const NGROK_REGEX = /\.ngrok[-\w]*\.app$/;
app.use(
  cors({
    origin: (origin, cb) => {
      // Apps nativos (sem origin) — permite
      if (!origin) return cb(null, true);

      try {
        const { hostname } = new URL(origin);
        if (
          NGROK_REGEX.test(hostname) ||
          hostname.includes('localhost') ||
          hostname.startsWith('192.168.') ||
          hostname === '127.0.0.1'
        ) {
          return cb(null, true);
        }
        return cb(new Error(`Origin not allowed by CORS: ${origin}`));
      } catch {
        return cb(null, true);
      }
    },
    credentials: true,
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan('dev'));

// Health-check
app.get('/api/health', (req, res) => {
  res.json({ ok: true, time: Date.now() });
});

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/pets', petRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/campaigns', campaignRoutes);

// DB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB conectado'))
  .catch((err) => console.error(err));

// Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));