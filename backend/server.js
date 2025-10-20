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

// Middlewares
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan('dev'));

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/pets', petRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/campaigns', campaignRoutes);

// DB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB conectado'))
  .catch(err => console.error(err));

// Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));