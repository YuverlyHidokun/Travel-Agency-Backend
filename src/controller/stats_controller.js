import Usuario from "../models/User.js";
import Reserva from "../models/Reservation.js";

export const obtenerEstadisticas = async (req, res) => {
  try {
    // Total de usuarios
    const totalUsuarios = await Usuario.countDocuments();

    // Total de reservas
    const totalReservas = await Reserva.countDocuments();

    // Agrupar reservas por estado
    const reservasPorEstado = await Reserva.aggregate([
      {
        $group: {
          _id: "$estado",
          total: { $sum: 1 }
        }
      }
    ]);

    // Reservas por mes (últimos 12 meses)
    const reservasPorMes = await Reserva.aggregate([
      {
        $group: {
          _id: {
            mes: { $month: "$createdAt" },
            año: { $year: "$createdAt" }
          },
          total: { $sum: 1 }
        }
      },
      {
        $sort: {
          "_id.año": 1,
          "_id.mes": 1
        }
      }
    ]);

    res.json({
      totalUsuarios,
      totalReservas,
      reservasPorEstado,
      reservasPorMes
    });
  } catch (error) {
    console.error("❌ Error al obtener estadísticas:", error);
    res.status(500).json({ msg: "Error interno al obtener estadísticas" });
  }
};
