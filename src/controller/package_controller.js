import Paquete from "../models/Package.js";

// Crear un nuevo paquete turístico
const crearPaquete = async (req, res) => {
  try {
    const imagenes = req.files.map(file => file.path);

    const {
      nombre,
      descripcion,
      precio,
      ubicacion,
      origen,
      destino,
      tipo,
      clase,
      maxPasajeros
    } = req.body;

    // Validación básica
    if (
      [nombre, descripcion, precio, ubicacion, origen, destino, tipo].includes("") ||
      imagenes.length === 0
    ) {
      return res.status(400).json({ msg: "Todos los campos son obligatorios y al menos una imagen debe ser cargada." });
    }

    const nuevoPaquete = new Paquete({
      nombre,
      descripcion,
      precio,
      ubicacion,
      origen,
      destino,
      tipo,
      clase: clase || "Económica",
      maxPasajeros: maxPasajeros || 10,
      imagenes
    });

    await nuevoPaquete.save();

    res.status(201).json({
      msg: "Paquete creado correctamente",
      paquete: nuevoPaquete
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error al crear el paquete", error });
  }
};


// Obtener todos los paquetes
const obtenerPaquetes = async (req, res) => {
  try {
    const paquetes = await Paquete.find().sort({ createdAt: -1 });
    res.status(200).json(paquetes);
  } catch (error) {
    res.status(500).json({ msg: "Error al obtener los paquetes", error });
  }
};

// Obtener un paquete por ID
const obtenerPaquetePorId = async (req, res) => {
  const { id } = req.params;

  try {
    const paquete = await Paquete.findById(id).populate("reseñas.usuario", "nombre email");

    if (!paquete) {
      return res.status(404).json({ msg: "Paquete no encontrado" });
    }

    res.status(200).json(paquete);
  } catch (error) {
    res.status(500).json({ msg: "Error al obtener el paquete", error });
  }
};

// Actualizar un paquete
const actualizarPaquete = async (req, res) => {
  const { id } = req.params;
  const {
    nombre,
    descripcion,
    precio,
    ubicacion,
    origen,
    destino,
    tipo,
    clase,
    maxPasajeros
  } = req.body;

  try {
    const paquete = await Paquete.findById(id);
    if (!paquete) {
      return res.status(404).json({ msg: "Paquete no encontrado" });
    }

    // Actualizar campos si vienen
    if (nombre) paquete.nombre = nombre;
    if (descripcion) paquete.descripcion = descripcion;
    if (precio) paquete.precio = precio;
    if (ubicacion) paquete.ubicacion = ubicacion;
    if (origen) paquete.origen = origen;
    if (destino) paquete.destino = destino;
    if (tipo) paquete.tipo = tipo;
    if (clase) paquete.clase = clase;
    if (maxPasajeros) paquete.maxPasajeros = maxPasajeros;

    // Actualizar imágenes si se enviaron nuevas
    if (req.files && req.files.length > 0) {
      paquete.imagenes = req.files.map(file => file.filename);
    }

    await paquete.save();

    res.status(200).json({
      msg: "Paquete actualizado correctamente",
      paquete
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al actualizar el paquete", error });
  }
};


// Eliminar un paquete
const eliminarPaquete = async (req, res) => {
  const { id } = req.params;

  try {
    const paquete = await Paquete.findById(id);
    if (!paquete) {
      return res.status(404).json({ msg: "Paquete no encontrado" });
    }

    await paquete.deleteOne();
    res.status(200).json({ msg: "Paquete eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ msg: "Error al eliminar el paquete", error });
  }
};

// Agregar una reseña a un paquete


const agregarReseña = async (req, res) => {
  
  const { id } = req.params;
  const { comentario, calificacion } = req.body;
  const usuario = req.usuario?._id;

  if (!usuario || !comentario || !calificacion) {
    return res.status(400).json({ msg: "Todos los campos son obligatorios para la reseña." });
  }

  try {
    const paquete = await Paquete.findById(id);
    if (!paquete) {
      return res.status(404).json({ msg: "Paquete no encontrado" });
    }

    paquete.reseñas.push({ usuario, comentario, calificacion });

    // Calcular nuevo promedio
    const total = paquete.reseñas.reduce((acc, item) => acc + item.calificacion, 0);
    paquete.calificacion = total / paquete.reseñas.length;

    await paquete.save();

    return res.status(201).json({ msg: "Reseña agregada correctamente", paquete });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Error al agregar la reseña", error });
  }
};

const buscarPaquetes = async (req, res) => {
  try {
    const { tipo, origen, destino, clase, pasajeros } = req.query;

    const filtros = {};

    if (origen) filtros.origen = { $regex: origen, $options: 'i' };
    if (destino) filtros.destino = { $regex: destino, $options: 'i' };
    if (tipo) filtros.tipo = { $regex: tipo, $options: 'i' };
    if (clase) filtros.clase = { $regex: clase, $options: 'i' };
    if (pasajeros) filtros.maxPasajeros = { $gte: parseInt(pasajeros) };

    const paquetes = await Paquete.find(filtros).sort({ createdAt: -1 });
    res.status(200).json(paquetes);
  } catch (error) {
    res.status(500).json({ msg: "Error al buscar paquetes", error });
  }
};

const eliminarResena = async (req, res) => {
  const { idPaquete, idResena } = req.params;

  try {
    const paquete = await Paquete.findById(idPaquete);
    if (!paquete) {
      return res.status(404).json({ msg: "Paquete no encontrado" });
    }

    // Verificar si la reseña existe
    const resenaExistente = paquete.resenas.id(idResena);
    if (!resenaExistente) {
      return res.status(404).json({ msg: "Reseña no encontrada" });
    }

    // Eliminar reseña
    resenaExistente.deleteOne();

    // Recalcular calificación promedio
    const total = paquete.resenas.reduce((acc, item) => acc + item.calificacion, 0);
    paquete.calificacion = paquete.resenas.length
      ? total / paquete.resenas.length
      : 0;

    await paquete.save();

    res.json({ msg: "Reseña eliminada correctamente", paquete });
  } catch (error) {
    console.error("❌ Error en eliminarResena:", error);
    res.status(500).json({ msg: "Error interno al eliminar la reseña", error });
  }
};



export {
  crearPaquete,
  obtenerPaquetes,
  obtenerPaquetePorId,
  actualizarPaquete,
  eliminarPaquete,
  agregarReseña,
  buscarPaquetes,
  eliminarResena
};
