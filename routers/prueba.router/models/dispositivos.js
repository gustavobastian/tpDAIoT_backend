const mongoose = require('mongoose');

const dispositivoSchema = mongoose.Schema({
    dispositivoId: {
        type: Number,
        require: true
    },
    nombre: {
        type: String,
        require: true
    },
    ubicacion: {
        type: String
    },
    luz1: {
        type: Number,
    },
    luz2: {
        type: Number,
    },
    temperatura: {
        type: Number,
    },
    humedad: {
        type: Number,
    },
    topic: {
        type: String,
        require: true
    },
    topicSrvResponse: {
        type: String,
        require: true
    },    
    status: {
        type: String,
        require: true
    }
});

module.exports = mongoose.model('Dispositivo', dispositivoSchema);
