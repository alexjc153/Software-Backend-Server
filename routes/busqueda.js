var express = require('express');

var app = express();

var Perfil = require('../models/perfil');
var Usuario = require('../models/usuario');
var Grupo = require('../models/grupo');


// =====================================================
// Búsqueda por colección
// =====================================================

app.get('/coleccion/:tabla/:busqueda', (req, res) => {

    var busqueda = req.params.busqueda;
    var regex = new RegExp(busqueda, 'i');
    var tabla = req.params.tabla;

    var promesa;

    switch (tabla) {
        case 'usuarios':
            promesa = buscarUsuarios(busqueda, regex);
            break;

        case 'perfiles':
            promesa = buscarPerfiles(busqueda, regex);
            break;

        case 'grupos':
            promesa = buscarGrupos(busqueda, regex);
            break;

        default:
            return res.status(400).json({
                ok: false,
                mensaje: 'Los tipos de búsqueda solo pueden ser de perfiles, usuarios, grupos',
                error: { message: 'Tipo de tabla/colección no válido' }
            });
    }

    promesa.then(data => {
        res.status(200).json({
            ok: true,
            [tabla]: data
        });
    });

});

// =====================================================
// Búsqueda General
// =====================================================

app.get('/todo/:busqueda', (req, res, next) => {

    var busqueda = req.params.busqueda;
    var regex = new RegExp(busqueda, 'i');


    Promise.all([
        buscarPerfiles(busqueda, regex),
        buscarUsuarios(busqueda, regex),
        buscarGrupos(busqueda, regex)
    ]).then(respuestas => {
        res.status(200).json({
            ok: true,
            perfiles: respuestas[0],
            usuarios: respuestas[1],
            grupos: respuestas[2],
        });
    });

});


function buscarGrupos(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Grupo.find({ nombre: regex })
            .populate('usuario', 'nombre username img')
            .exec(
                (err, grupos) => {
                    if (err) {
                        reject('Error al cargar Grupos', err);
                    } else {
                        resolve(grupos);
                    }
                });

    });
}

function buscarPerfiles(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Perfil.find({ nombre: regex })
            .populate('usuario', 'nombre username img')
            .exec(
                (err, perfiles) => {
                    if (err) {
                        reject('Error al cargar Perfiles', err);
                    } else {
                        resolve(perfiles);
                    }
                });

    });
}

function buscarUsuarios(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Usuario.find({}, 'nombre username perfil img')
            .populate('perfil', 'nombre')
            .or([{ 'nombre': regex }, { 'username': regex }])
            .exec(
                (err, usuarios) => {
                    if (err) {
                        reject('Error al cargar Usuarios', err);
                    } else {
                        resolve(usuarios);
                    }
                });

    });
}


module.exports = app;