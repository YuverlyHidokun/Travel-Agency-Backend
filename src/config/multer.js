import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinary.js";  // Importa la instancia configurada

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,  // Usa la instancia configurada
  params: {
    folder: "travel_agency",
    allowed_formats: ["jpg", "jpeg", "png"],
  },
});

const parser = multer({ storage: storage });

export default parser;