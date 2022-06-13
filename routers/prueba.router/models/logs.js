const mongoose = require('mongoose');

const logsSchema = mongoose.Schema({
    logId: {
        type: Number,
        require: true
    },
    ts: {
        type: Number,
        require: true,
        default: new Date().getTime()
    },
    eluz1: {
        type: Number,
    },
    eluz2: {
        type: Number,
    },
    etemperatura: {
        type: Number,
    },
    ehumedad: {
        type: Number,
    },
    nodoId: {
        type: Number,
        require: true
    }
});

module.exports = mongoose.model('Logs', logsSchema);
