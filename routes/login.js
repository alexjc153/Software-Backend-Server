var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var SEED = require('../config/config').SEED;

var app = express();

var Usuario = require('../models/usuario');


app.post('/', (req, res) => {

    var body = req.body;

    Usuario.findOne({ username: body.username }, (err, usuarioDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al encontrar los usuarios.',
                errors: err
            });
        }

        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Nombre de Usuario o Contraseña incorrectos',
                errors: err,
            });
        }

        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Nombre de Usuario o Contraseña incorrectos',
                errors: err
            });
        }

        usuarioDB.password = ':)';

        // Crear un token!!
        var token = jwt.sign({ usuario: usuarioDB }, SEED, { expiresIn: 14400 }); // 04 Horas expiración


        res.status(200).json({
            ok: true,
            usuario: usuarioDB,
            token: token,
            id: usuarioDB._id
        });

    });


});

module.exports = app;