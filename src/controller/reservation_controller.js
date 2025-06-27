import Reserva from "../models/Reserva.js";
import Paquete from "../models/Paquete.js";

// Crear una nueva reserva
const crearReserva = async (req, res) => {
  const { paquete: paqueteId, pasajeros, fechaViaje } = req.body;
  const usuarioId = req.usuario?._id;

  if (!usuarioId || !paqueteId || !pasajeros || !fechaViaje) {
    return res.status(400).json({ msg: "Todos los campos son obligatorios." });
  }

  try {
    const paqueteExiste = await Paquete.findById(paqueteId);
    if (!paqueteExiste) {
      return res.status(404).json({ msg: "Paquete no encontrado." });
    }

    const nuevaReserva = new Reserva({
      usuario: usuarioId,
      paquete: paqueteId,
      pasajeros,
      fechaViaje
    });

    await nuevaReserva.save();

    res.status(201).json({
      msg: "Reserva creada correctamente",
      reserva: nuevaReserva
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al crear la reserva", error });
  }
};

// Obtener todas las reservas (admin o para fines de prueba)
const obtenerReservas = async (req, res) => {
  try {
    const reservas = await Reserva.find()
      .populate("usuario", "nombre email")
      .populate("paquete", "nombre precio ubicacion");

    res.status(200).json(reservas);
  } catch (error) {
    res.status(500).json({ msg: "Error al obtener las reservas", error });
  }
};

// Obtener reservas del usuario autenticado
const obtenerMisReservas = async (req, res) => {
  const usuarioId = req.usuario?._id;

  try {
    const reservas = await Reserva.find({ usuario: usuarioId })
      .populate("paquete", "nombre precio ubicacion");

    res.status(200).json(reservas);
  } catch (error) {
    res.status(500).json({ msg: "Error al obtener tus reservas", error });
  }
};

// Obtener una reserva por ID
const obtenerReservaPorId = async (req, res) => {
  const { id } = req.params;

  try {
    const reserva = await Reserva.findById(id)
      .populate("usuario", "nombre email")
      .populate("paquete", "nombre precio ubicacion");

    if (!reserva) {
      return res.status(404).json({ msg: "Reserva no encontrada" });
    }

    res.status(200).json(reserva);
  } catch (error) {
    res.status(500).json({ msg: "Error al obtener la reserva", error });
  }
};

// Actualizar una reserva
const actualizarReserva = async (req, res) => {
  const { id } = req.params;
  const { pasajeros, fechaViaje, estado } = req.body;
  const usuarioId = req.usuario?._id;

  try {
    const reserva = await Reserva.findById(id);

    if (!reserva) {
      return res.status(404).json({ msg: "Reserva no encontrada" });
    }

    // Solo el dueño puede actualizar su reserva (o aquí se puede agregar verificación admin)
    if (reserva.usuario.toString() !== usuarioId.toString()) {
      return res.status(403).json({ msg: "Acceso no autorizado" });
    }

    reserva.pasajeros = pasajeros || reserva.pasajeros;
    reserva.fechaViaje = fechaViaje || reserva.fechaViaje;
    reserva.estado = estado || reserva.estado;

    await reserva.save();

    res.status(200).json({
      msg: "Reserva actualizada correctamente",
      reserva
    });
  } catch (error) {
    res.status(500).json({ msg: "Error al actualizar la reserva", error });
  }
};

// Eliminar una reserva
const eliminarReserva = async (req, res) => {
  const { id } = req.params;
  const usuarioId = req.usuario?._id;

  try {
    const reserva = await Reserva.findById(id);

    if (!reserva) {
      return res.status(404).json({ msg: "Reserva no encontrada" });
    }

    if (reserva.usuario.toString() !== usuarioId.toString()) {
      return res.status(403).json({ msg: "Acceso no autorizado" });
    }

    await reserva.deleteOne();

    res.status(200).json({ msg: "Reserva eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ msg: "Error al eliminar la reserva", error });
  }
};

export {
  crearReserva,
  obtenerReservas,
  obtenerMisReservas,
  obtenerReservaPorId,
  actualizarReserva,
  eliminarReserva
};
