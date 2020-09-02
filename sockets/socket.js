const { io } = require('../index');
const Bands = require('../models/bands');
const Band = require('../models/band');

const bands = new Bands();

bands.addBand(new Band('Queen'));
bands.addBand(new Band('Bon Jovi'));
bands.addBand(new Band('Heroes del Silencio'));
bands.addBand(new Band('Metallica'));

console.log(bands);

// Mensajes de Sockets
io.on('connection', client => {
    console.log('Cliente conectado');

    client.emit('active-bands', bands.getBands());
    // client.on('event', data => { /* … */ });
    client.on('disconnect', () => {
        console.log('Cliente desconectado');
    });

    client.on('mensaje', (payload) => {
        console.log('Mensaje!!', payload.nombre);

        io.emit('mensaje', { admin: 'Nuevo mensaje' });
    })

    client.on('emitir-mensaje', (payload) => {
        // io.emit('nuevo-mensaje', payload); //Emite a todos
        client.broadcast.emit('nuevo-mensaje', payload); //Emitre a toso menos el que emite
    });

    client.on('vote-band', (payload) => {
        console.log(payload);
        bands.voteBand(payload.id);
        io.emit('active-bands', bands.getBands());
    })

    client.on('add-band', (payload) => {
        console.log(payload);
        bands.addBand(new Band(payload.name));
        io.emit('active-bands', bands.getBands());

    })

    client.on('delete-band', (payload) => {
        console.log(payload);
        bands.deleteBand(payload.id);
        io.emit('active-bands', bands.getBands());
    })
});