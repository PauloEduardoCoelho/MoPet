const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema(
  {
    cep: { type: String, required: true, trim: true },

    address: {
      street: { type: String },
      neighborhood: { type: String },
      city: { type: String },
      state: { type: String }
    },
    number: { type: String },
    placeName: { type: String },
    reference: { type: String },

    day: { type: String, required: true, trim: true },   // 'YYYY-MM-DD'
    time: { type: String, required: true, trim: true },  // 'HH:mm' ou 'HH:mm-HH:mm'
    capacity: { type: Number, required: true, min: 1 },

    // <<< INSCRIÇÕES >>>
    enrollments: [
      {
        pet:   { type: mongoose.Schema.Types.ObjectId, ref: 'Pet', required: true },
        owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        createdAt: { type: Date, default: Date.now }
      }
    ],

    status: { type: String, enum: ['active', 'closed'], default: 'active' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Campaign', campaignSchema);