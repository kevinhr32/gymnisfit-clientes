const mongoose = require('mongoose');

const planes = ['MENSUAL', 'TRIMESTRAL', 'ANUAL'];

const clienteSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, 'El nombre es obligatorio.'],
      trim: true,
    },
    documento: {
      type: String,
      required: [true, 'El documento es obligatorio.'],
      unique: true,
      trim: true,
    },
    correo: {
      type: String,
      required: [true, 'El correo es obligatorio.'],
      lowercase: true,
      trim: true,
    },
    telefono: {
      type: String,
      trim: true,
      default: '',
    },
    plan: {
      type: String,
      enum: {
        values: planes,
        message: 'El plan debe ser MENSUAL, TRIMESTRAL o ANUAL.',
      },
      default: 'MENSUAL',
    },
    fechaVencimiento: {
      type: Date,
      required: [true, 'La fecha de vencimiento es obligatoria.'],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

clienteSchema.virtual('estado').get(function obtenerEstado() {
  const milisegundosPorDia = 1000 * 60 * 60 * 24;
  const hoy = new Date();
  const fechaHoy = Date.UTC(hoy.getUTCFullYear(), hoy.getUTCMonth(), hoy.getUTCDate());
  const fechaVencimiento = new Date(this.fechaVencimiento);
  const fechaFin = Date.UTC(
    fechaVencimiento.getUTCFullYear(),
    fechaVencimiento.getUTCMonth(),
    fechaVencimiento.getUTCDate(),
  );
  const diasRestantes = Math.ceil((fechaFin - fechaHoy) / milisegundosPorDia);

  if (diasRestantes < 0) {
    return 'VENCIDO';
  }

  if (diasRestantes <= 7) {
    return 'POR_VENCER';
  }

  return 'ACTIVO';
});

module.exports = mongoose.model('Cliente', clienteSchema);
