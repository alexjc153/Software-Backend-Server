// Requires
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');


// Inicializar variables
var app = express();

// CORS
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
    next();
});


// Body Parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Conexión a la base de datos
mongoose.connect('mongodb://localhost:27017/lotizacionDB', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, }, (err, res) => {

    if (err) { throw err; }

    console.log('Base de datos: \x1b[32m%s\x1b[0m', 'Online');

});


// Server index Config
var serverIndex = require('serve-index');
app.use(express.static(__dirname + '/'));
app.use('uploads', serverIndex(__dirname + '/uploads'));

// Importar rutas
var appRoutes = require('./routes/app');
var grupoRoutes = require('./routes/grupo');
var categoriaRoutes = require('./routes/categoria');
var perfilRoutes = require('./routes/perfil');
var usuarioRoutes = require('./routes/usuario');
var loginRoutes = require('./routes/login');
var busquedaRoutes = require('./routes/busqueda');
var uploadRoutes = require('./routes/upload');
var imagenesRoutes = require('./routes/imagenes');



// Rutas
app.use('/usuario', usuarioRoutes);
app.use('/perfil', perfilRoutes);
app.use('/grupo', grupoRoutes);
app.use('/categoria', categoriaRoutes);
app.use('/login', loginRoutes);
app.use('/busqueda', busquedaRoutes);
app.use('/upload', uploadRoutes);
app.use('/img', imagenesRoutes);

app.use('/', appRoutes);





// Escuchar peticiones
app.listen(3000, () => {
    console.log('Express Server Puerto 3000: \x1b[32m%s\x1b[0m', 'Online');
});