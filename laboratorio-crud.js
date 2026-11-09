const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Ticket = require("./models/tickets");

dotenv.config();

async function ejecutarCicloCrud() {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error("Falta definir MONGODB_URI en el archivo .env");
        }

        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Conectado a MongoDB Atlas");

        // Borra todos los tickets de la colección antes de insertar los ejemplos.
        await Ticket.deleteMany({});

        console.log("---- 1. Fase Create: insertando tickets iniciales");

        const ticketsCreados = await Ticket.insertMany([
            {
                codigo: "BUG-101",
                titulo: "Pasarela de pago lanza error 500 con tarjetas Visa",
                prioridad: "Critica",
                estado: "Abierto",
                etiquetas: ["pagos", "backend", "produccion"],
            },
            {
                codigo: "BUG-102",
                titulo: "El botón de login se desalinea en pantallas móviles",
                prioridad: "Baja",
                estado: "En progreso",
                agenteAsignado: "Sofía Castro",
                horasInvertidas: 2,
                etiquetas: ["ui", "css", "movil"],
            },
            {
                codigo: "BUG-103",
                titulo: "Fuga de memoria en el servidor de WebSockets",
                prioridad: "Alta",
                estado: "En progreso",
                agenteAsignado: "Marcos Vega",
                horasInvertidas: 5,
                etiquetas: ["backend", "rendimiento", "produccion"],
            },
            {
                codigo: "BUG-104",
                titulo: "Error tipográfico en el pie de página de contacto",
                prioridad: "Baja",
                estado: "Resuelto",
                agenteAsignado: "Sofía Castro",
                horasInvertidas: 1,
                etiquetas: ["ui", "texto"],
            },
            {
                codigo: "BUG-105",
                titulo: "Lentitud al exportar reportes en PDF desde el panel",
                prioridad: "Media",
                estado: "Abierto",
                etiquetas: ["backend", "reportes"],
            },
        ]);

        console.log(`Se insertaron ${ticketsCreados.length} tickets.`);

        // 2. READ (Consultas con Operadores)
        console.log("--- 2. Fase Read: Consultas con operadores");

        // $or devuelve documentos que cumplan al menos con una condicion: prioridad critica o mas de cuatro
        // .select limita los campos de la respuesta
        // el signo delante de _id excluye ese campo
        // Los resultados se guardan en una variable que podemos inspeccionar despues.
        // find devuelve una lista, incluso cuando hay una sola coincidencia.
        const urgentesOComplejos = await Ticket.find({
            $or: [{ prioridad: "Critica" }, { horasInvertidas: { $gt: 4 } }],
        }).select("codigo titulo prioridad horasInvertidas -_id");
        console.log("A) Criticos ó con > 4 horas ($or):", urgentesOComplejos);
    } catch (error) {
        // Si alguna operacion falla en el try, el flujo salta hacia aqui, el error se informa
        console.error("Error en el lab:", error.message);
        process.exitCode = 1;
    } finally {
        await mongoose.disconnect();
        console.log("\nDesconectado de Mongo Atlas");
    }
}

ejecutarCicloCrud();