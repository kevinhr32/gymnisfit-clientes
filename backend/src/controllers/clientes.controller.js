const Cliente = require('../models/Cliente');

const camposPermitidos = ['nombre', 'documento', 'correo', 'telefono', 'plan', 'fechaVencimiento'];

function obtenerDatosCliente(cuerpo) {
  const datos = cuerpo && typeof cuerpo === 'object' ? cuerpo : {};

  return Object.fromEntries(
    camposPermitidos
      .filter((campo) => Object.prototype.hasOwnProperty.call(datos, campo))
      .map((campo) => [campo, datos[campo]]),
  );
}

function responderError(res, error) {
  if (error?.code === 11000) {
    return res.status(400).json({ mensaje: 'El documento ya está registrado.' });
  }

  if (error?.name === 'ValidationError') {
    const mensajes = Object.values(error.errors).map((detalle) => detalle.message);
    return res.status(400).json({ mensaje: mensajes.join(' ') });
  }

  console.error(error);
  return res.status(500).json({ mensaje: 'Ocurrió un error en el servidor.' });
}

async function listarClientes(_req, res) {
  try {
    const clientes = await Cliente.find().sort({ createdAt: -1 });
    return res.json(clientes);
  } catch (error) {
    return responderError(res, error);
  }
}

async function obtenerCliente(req, res) {
  try {
    const cliente = await Cliente.findById(req.params.id);

    if (!cliente) {
      return res.status(404).json({ mensaje: 'Cliente no encontrado.' });
    }

    return res.json(cliente);
  } catch (error) {
    if (error?.name === 'CastError') {
      return res.status(404).json({ mensaje: 'Cliente no encontrado.' });
    }

    return responderError(res, error);
  }
}

async function crearCliente(req, res) {
  try {
    const cliente = await Cliente.create(obtenerDatosCliente(req.body));
    return res.status(201).json(cliente);
  } catch (error) {
    return responderError(res, error);
  }
}

async function actualizarCliente(req, res) {
  try {
    const cliente = await Cliente.findByIdAndUpdate(
      req.params.id,
      obtenerDatosCliente(req.body),
      { new: true, runValidators: true },
    );

    if (!cliente) {
      return res.status(404).json({ mensaje: 'Cliente no encontrado.' });
    }

    return res.json(cliente);
  } catch (error) {
    if (error?.name === 'CastError') {
      return res.status(404).json({ mensaje: 'Cliente no encontrado.' });
    }

    return responderError(res, error);
  }
}

async function eliminarCliente(req, res) {
  try {
    const cliente = await Cliente.findByIdAndDelete(req.params.id);

    if (!cliente) {
      return res.status(404).json({ mensaje: 'Cliente no encontrado.' });
    }

    return res.status(204).send();
  } catch (error) {
    if (error?.name === 'CastError') {
      return res.status(404).json({ mensaje: 'Cliente no encontrado.' });
    }

    return responderError(res, error);
  }
}

module.exports = {
  listarClientes,
  obtenerCliente,
  crearCliente,
  actualizarCliente,
  eliminarCliente,
};
