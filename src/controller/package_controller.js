import Paquete from "../models/Package.js";

// Crear un nuevo paquete turístico
const crearPaquete = async (req, res) => {
  const { name, description, images, price, location } = req.body;

  if ([name, description, images, price, location].includes("") || images.length === 0) {
    return res.status(400).json({ msg: "Todos los campos son obligatorios y al menos una imagen debe ser cargada." });
  }

  try {
    const nuevoPaquete = new Paquete({
      name,
      description,
      images,
      price,
      location
    });

    await nuevoPaquete.save();

    res.status(201).json({
      msg: "Paquete creado correctamente",
      paquete: nuevoPaquete
    });
  } catch (error) {
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
    const paquete = await Paquete.findById(id).populate("reviews.user", "nombre email");

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
  const { name, description, images, price, location } = req.body;

  try {
    const paquete = await Paquete.findById(id);
    if (!paquete) {
      return res.status(404).json({ msg: "Paquete no encontrado" });
    }

    paquete.name = name || paquete.name;
    paquete.description = description || paquete.description;
    paquete.images = images || paquete.images;
    paquete.price = price || paquete.price;
    paquete.location = location || paquete.location;

    await paquete.save();

    res.status(200).json({
      msg: "Paquete actualizado correctamente",
      paquete
    });
  } catch (error) {
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
  const { user, comment, rating } = req.body;

  if (!user || !comment || !rating) {
    return res.status(400).json({ msg: "Todos los campos son obligatorios para la reseña." });
  }

  try {
    const paquete = await Paquete.findById(id);
    if (!paquete) {
      return res.status(404).json({ msg: "Paquete no encontrado" });
    }

    paquete.reviews.push({ user, comment, rating });

    // Calcular el nuevo promedio
    const total = paquete.reviews.reduce((acc, item) => acc + item.rating, 0);
    paquete.rating = total / paquete.reviews.length;

    await paquete.save();

    res.status(201).json({ msg: "Reseña agregada correctamente", paquete });
  } catch (error) {
    res.status(500).json({ msg: "Error al agregar la reseña", error });
  }
};

export {
  crearPaquete,
  obtenerPaquetes,
  obtenerPaquetePorId,
  actualizarPaquete,
  eliminarPaquete,
  agregarReseña
};
