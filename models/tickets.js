const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema({
    codigo: {
        type: String,
        required: [true, "El código del ticket es obligatorio"],
        unique: true,
        uppercase: true,
        trim: true,
    },
    titulo: {
        type: String,
        required: [true, "El título es obligatorio"],
        trim: true,
        minlength: [5, "El título debe tener al menos 5 caracteres"],
    },
    prioridad: {
        type: String,
        required: true,
        enum: {
            values: ["Baja", "Media", "Alta", "Critica"],
            message: "{VALUE} no es una prioridad válida",
        },
        default: "Media",
    },
    estado: {
        type: String,
        required: [true, "El estado es obligatorio"],
        enum: ["Abierto", "En progreso", "Resuelto", "Cerrado"],
        default: "Abierto",
    },
    agenteAsignado: {
        type: String,
        trim: true,
    },
    horasInvertidas: {
        type: Number,
        default: 0,
        min: [0, "Las horas no pueden ser negativas"],
    },
    etiquetas: {
        type: [String],
        default: [],
    },
},

{timestamps:true

},


);

const Ticket = mongoose.models.Ticket || mongoose.model("Ticket", ticketSchema);

module.exports = Ticket;
